import TelegramBot from "node-telegram-bot-api";
/*
import {
    findUserByChatId,
    findUserByPhoneNumber,
    updateUserChatId,
} from "./services/user-service";
*/
import { getExternalAppConfig } from "./firebase-config";
import {
    // Contact,
    InlineKeyboardMarkup,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
    TelegramMessage,
} from "./types/telegram";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN environment variable is required but not set");
}

const bot = new TelegramBot(BOT_TOKEN, {
    polling: {
        interval: 3000,
        autoStart: true,
    },
});

// Handle /start command
bot.onText(/\/start/, async (msg: TelegramMessage) => {
    const chatId = msg.chat.id;
    console.log(`🔔 RECEIVED /start command from chat ${chatId}`);

    // For now, allow direct launch without phone verification
    await sendMessage(
        chatId,
        `👋 Welcome to GarageBet!\n\nClick the button below to open the GarageBet app.`,
        createAuthenticatedKeyboard()
    );

    /* 
    // Check if user is already verified
    const result = await findUserByChatId(chatId);
    if (result) {
        await sendMessage(
            chatId,
            `👋 Welcome back, ${result.user.firstName}!\n\nYou are already verified. Click the button below to open the GarageBet app.`,
            createAuthenticatedKeyboard()
        );
    } else {
        await sendContactRequest(chatId);
    }
    */
});

// Handle phone number sharing
/*
bot.on("message", async (msg: TelegramMessage) => {
    if (msg.contact) {
        await handleContactShare(msg.chat.id, msg.contact as Contact);
    }
});
*/

// Keyboard for phone number request
/*
function createContactKeyboard(): ReplyKeyboardMarkup {
    return {
        keyboard: [[{ text: "📱 Share Phone Number", request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
    };
}
*/

// Inline keyboard for authorized users
function createAuthenticatedKeyboard(): InlineKeyboardMarkup {
    const config = getExternalAppConfig();
    return {
        inline_keyboard: [[
            {
                text: "🚀 Open GarageBet App",
                web_app: {
                    url: config.domain
                }
            }
        ]]
    };
}

/*
async function sendContactRequest(chatId: number) {
    const keyboard = createContactKeyboard();
    return sendMessage(
        chatId,
        "👋 Welcome to GarageBet Bot!\n\nPlease share your phone number to verify your account and access the app.",
        keyboard
    );
}
*/

/*
async function handleContactShare(chatId: number, contact: Contact) {
    const phoneNumber = contact.phone_number;
    const cleanPhone = phoneNumber.replace(/[\s\-()]/g, "");
    const normalizedPhone = cleanPhone.startsWith("+") ? cleanPhone : "+" + cleanPhone;

    await sendMessage(chatId, "⏳ Verifying your phone number...");

    try {
        const result = await findUserByPhoneNumber(normalizedPhone);
        if (result) {
            const { user, projectName } = result;
            const success = await updateUserChatId(user.id, chatId, projectName);
            if (success) {
                await sendMessage(
                    chatId,
                    `✅ Verified!\n\nWelcome ${user.firstName}. You can now open the app using the button below.`,
                    createAuthenticatedKeyboard()
                );
            } else {
                await sendMessage(chatId, "❌ Failed to link account. Please try again.");
            }
        } else {
            await sendMessage(
                chatId,
                "❌ Account not found. Please ensure your phone number is registered on GarageBet.",
                { remove_keyboard: true }
            );
        }
    } catch (error) {
        console.error("Error in handleContactShare:", error);
        await sendMessage(chatId, "❌ An error occurred. Please try again later.");
    }
}
*/

async function sendMessage(
    chatId: number,
    text: string,
    keyboard?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove
): Promise<TelegramBot.Message> {
    return bot.sendMessage(chatId, text, {
        parse_mode: "HTML",
        reply_markup: keyboard,
    });
}

export { bot };
