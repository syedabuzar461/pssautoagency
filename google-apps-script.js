/**
 * Google Apps Script for PSS Digital Agency Leads
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.google.com) logged in with syedabuzar461@gmail.com
 * 2. Create a new Sheet (e.g. "PSS Client Leads")
 * 3. Go to Extensions > Apps Script
 * 4. Replace any existing code with this script
 * 5. Click "Deploy" > "New deployment"
 * 6. Select type "Web app"
 *    - Description: "PSS Leads Webhook"
 *    - Execute as: "Me (syedabuzar461@gmail.com)"
 *    - Who has access: "Anyone"
 * 7. Click "Deploy", authorize permissions, and copy the Web App URL
 * 8. Paste the Web App URL into config.js:
 *    window.CONFIG = { GOOGLE_SCRIPT_URL: 'YOUR_COPIED_URL_HERE' };
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "First Name",
        "Last Name",
        "Email",
        "Company",
        "Phone Number",
        "Service Interested",
        "Message"
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#c61f3e").setFontColor("#ffffff");
    }

    var p = e.parameter;
    var timestamp = new Date();
    var firstName = p.first_name || "";
    var lastName  = p.last_name || "";
    var email     = p.email_id || "";
    var company   = p.company_name || "";
    var phone     = p.phone_number || "";
    var service   = p.service_type || "";
    var message   = p.message || "";

    // Append to Google Sheet
    sheet.appendRow([
      timestamp,
      firstName,
      lastName,
      email,
      company,
      phone,
      service,
      message
    ]);

    // Send instant notification email to syedabuzar461@gmail.com
    var recipientEmail = "syedabuzar461@gmail.com";
    var subject = "🔥 New PSS Lead: " + firstName + " " + lastName + " (" + company + ")";
    var body = 
      "You have received a new client enquiry through PSS Digital Agency!\n\n" +
      "-------------------------------------------\n" +
      "Client Name: " + firstName + " " + lastName + "\n" +
      "Email: " + email + "\n" +
      "Phone: " + phone + "\n" +
      "Company: " + company + "\n" +
      "Service Interested: " + service + "\n" +
      "Message:\n" + message + "\n" +
      "-------------------------------------------\n" +
      "Recorded in your Google Sheet at: " + timestamp.toLocaleString();

    MailApp.sendEmail(recipientEmail, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
