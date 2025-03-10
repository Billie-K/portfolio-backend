const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

let users = {}; // Store user session data

exports.parse = async (req, res) => {
    const incomingMsg = req.body.Body.trim();
    const from = req.body.From;

    if (incomingMsg.toLowerCase() === "start over") {
        users[from] = { step: 0, data: {} };
    }

    if (!users[from]) {
        users[from] = { step: 0, data: {} };
    }

    const user = users[from];
    let response;

    switch (user.step) {
        case 0:
            response = `Welcome to Savannah Properties! Select your role:\n1. Tenant\n2. Service Provider\n3. Caretaker`;
            user.step = 1;
            break;

        case 1:
            if (incomingMsg === "1") {
                user.data.role = "Tenant";
                response = `How can we help you today? Select from the options below:\n1. Report an emergency\n2. Open a service complaint\n3. Pay rent\n4. Search for apartment\n5. File notice`;
                user.step = 2;
            } else if (incomingMsg === "2") {
                user.data.role = "Service Provider";
                response = `Before you continue, read our terms of service. If you agree, type "I agree"`;
                user.step = 100;
            } else if (incomingMsg === "3") {
                user.data.role = "Caretaker";
                response = `Thank you for choosing to serve Savannah Properties! Please provide your caretaker ID for verification.`;
                user.step = 200;
            } else {
                response = `Invalid selection. Please select 1, 2, or 3.`;
            }
            break;

        // Tenant Responses (Steps 2-7)
        case 2:
            switch (incomingMsg) {
                case "1":
                    response = `What emergency service do you need?\n1. Police\n2. Ambulance\n3. Fire brigade\n4. Child or Gender Based Violence`;
                    user.step = 3;
                    break;
                case "2":
                    response = `Could you share with us what the issue or complaint is? You can add a video or image of the issue.`;
                    user.step = 4;
                    break;
                case "3":
                    response = `Your rent is due. It is Ksh. 25,000 for 1st Jan to 31st Jan 2025. You can also pay in advance for the following months. How much would you like to pay?`;
                    user.step = 5;
                    break;
                case "4":
                    response = `Would you like to receive payment reminders? Yes or No`;
                    user.step = 6;
                    break;
                case "5":
                    response = `We have notified the caretaker to help you vacate.`;
                    user.step = 7;
                    break;
                default:
                    response = `Invalid selection. Please select 1, 2, 3, 4, or 5.`;
            }
            break;

        case 3:
            user.data.emergencyService = incomingMsg;
            response = `We have notified the caretaker to help you evacuate.`;
            user.step = 0;
            break;

        case 4:
            user.data.complaint = incomingMsg;
            response = `Thank you for letting us know. Stay around the apartment and once the issue has been repaired, we will notify you.`;
            user.step = 0;
            break;

        case 5:
            user.data.rentAmount = incomingMsg;
            response = `You will receive an MPESA prompt to complete the payment. Successful payment for January 2025 has been received.`;
            user.step = 0;
            break;

        case 6:
            user.data.paymentReminder = incomingMsg.toLowerCase() === "yes";
            response = `No problem. You can pay via WhatsApp before the deadline.`;
            user.step = 0;
            break;

        case 7:
            response = `Is there anything we can do to help in the meantime? We are here for you.`;
            user.step = 0;
            break;

        // Service Provider Responses (Steps 100-115)
        case 100:
            if (incomingMsg.toLowerCase() === "i agree") {
                response = `Select the kind of service you would like to provide:\n1. DSTV Installer\n2. Electrician\n3. Carpenter\n4. Plumber\n5. Pest control\n6. Cleaners\n7. Painter`;
                user.step = 101;
            } else {
                response = `You must agree to continue.`;
            }
            break;

        case 101:
            user.data.service = incomingMsg;
            response = `Fantastic! What is your First Name?`;
            user.step = 102;
            break;

        case 102:
            user.data.firstName = incomingMsg;
            response = `Nice meeting you ${incomingMsg}, how about your Last Name?`;
            user.step = 103;
            break;

        case 103:
            user.data.lastName = incomingMsg;
            response = `What's your ID Number?`;
            user.step = 104;
            break;

        case 104:
            user.data.idNumber = incomingMsg;
            response = `Are you located near UpperHill? Or can you find your way to our apartments? (Yes/No)`;
            user.step = 105;
            break;

        case 105:
            user.data.location = incomingMsg.toLowerCase() === "yes";
            response = `Do you provide round-the-clock service? (Yes/No)`;
            user.step = 106;
            break;

        case 106:
            user.data.roundClock = incomingMsg.toLowerCase() === "yes";
            response = `How would you like to engage with us?\n1. One time\n2. Weekly\n3. Bi-Weekly\n4. Monthly\n5. Yearly\n6. All the above`;
            user.step = 107;
            break;

        case 107:
            user.data.engagement = incomingMsg;
            response = `Since you will be engaging with us regularly, provide your payment method:\n1. MPESA\n2. Bank`;
            user.step = 108;
            break;

        case 108:
            user.data.paymentMethod = incomingMsg === "1" ? "MPESA" : "Bank";
            response = `Since you selected ${user.data.paymentMethod}, select the route:\n1. Send to my MPESA\n2. Paybill\n3. Pochi la Biashara`;
            user.step = 109;
            break;

        case 109:
            user.data.paymentRoute = incomingMsg;
            response = `Which number are we sending to?`;
            user.step = 110;
            break;

        case 110:
            user.data.phoneNumber = incomingMsg;
            response = `How many years of experience do you have?`;
            user.step = 111;
            break;

        case 111:
            user.data.experience = incomingMsg;
            response = `Could you list out your services one by one?`;
            user.step = 112;
            break;

        case 112:
            if (!user.data.services) user.data.services = [];
            user.data.services.push(incomingMsg);
            response = `Add another service or type "done" if finished.`;
            if (incomingMsg.toLowerCase() === "done") {
                user.step = 113;
                response = `Finally, share a 160-word bio that will appear when tenants search for you.`;
            }
            break;

        case 113:
            user.data.bio = incomingMsg;
            response = `Thank you! Your profile is complete. We'll notify you for potential clients. To navigate using a different role, simply type "start over".`;
            user.step = 114;
            break;

        default:
            response = `You've already completed your registration. Type "start over" to navigate using a different role.`;
    }

    // Caretaker Responses (Steps 200-202)
    switch (user.step) {
        case 200:
            user.data.caretakerID = incomingMsg;
            response = `Caretaker ID verified! Please proceed with your duties.`;
            user.step = 0;
            break;

        default:
            if (user.step >= 200 && user.step < 300) {
                response = `Please provide the necessary information to proceed.`;
                user.step++;
            }
            break;
    }

    await client.messages.create({
        from: WHATSAPP_NUMBER,
        to: from,
        body: response,
    });

};
