const BaleBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '2006942615:Qj8pFP7qJBrxSULRBBK7rgteiBnAsYu82GbxXpKB'; // توکن ربات بله

const options = {
    baseApiUrl: 'https://tapi.bale.ai',
};

const bot = new BaleBot(token, options);

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const msg_id = msg.message_id;

    const keyboard = {
        inline_keyboard: [
            [{ text: '👤 پروفایل کاربر', callback_data: 'profile' }],
            [{ text: '📞 ارتباط با ما', callback_data: 'contact' }],
            [{ text: '💰 حمایت مالی', callback_data: 'donate' }],
            [{ text: '🤖 ارتباط با هوش مصنوعی', callback_data: 'ai_chat' }]
        ]
    };

    await bot.sendMessage(chatId, 
        '🤖 **به Ehsan GPT خوش آمدید!**\n\n' +
        'سلام! من **Ehsan GPT** هستم، یک ربات مبتنی بر **هوش مصنوعی** که می‌تواند به سوالات شما پاسخ دهد، اطلاعات ارائه دهد و در انجام کارهای مختلف کمکتان کند.\n\n' +
        '🔹 سوالی داری؟ از من بپرس!\n' +
        '🔹 به دنبال راهنمایی هوشمندانه هستی؟ من اینجام!\n' +
        '🔹 نیاز به تحلیل و پردازش متن داری؟ روی من حساب کن!\n\n' +
        'از دکمه‌های زیر برای تعامل بیشتر با من استفاده کن. 👇', 
        {
            reply_to_message_id: msg_id,
            reply_markup: keyboard
        }
    );
});

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const msg_id = query.message.message_id;
    const data = query.data;

    let responseText = 'دستور نامشخص است!';

    switch (data) {
        case 'profile':
            responseText = `👤 پروفایل شما:\nنام: ${query.from.first_name}`;
            break;
        case 'contact':
            responseText = '📞 برای ارتباط با پشتیبانی به آیدی @Devehsan پیام دهید.';
            break;
        case 'donate':
            responseText = '💰 برای حمایت مالی لطفاً به این لینک مراجعه کنید: https://your-donate-link.com';
            break;
        case 'ai_chat':
            responseText = '🤖 لطفاً سوال خود را ارسال کنید تا پردازش شود.';
            break;
    }

    await bot.editMessageText(responseText, {
        chat_id: chatId,
        message_id: msg_id
    });
});

bot.on('message', async (msg) => {
    if (msg.text.toString().toLowerCase().indexOf('/start') === 0) {
        return;
    }

    const chatId = msg.chat.id;
    const userText = msg.text;
    const msg_id = msg.message_id;

    const please = await bot.sendMessage(chatId, 'لطفا کمی صبر کنید...', {
        reply_to_message_id: msg_id
    });

    try {
        const response = await axios.post('http://api.api4dev.ir/gptpost', {
            text: userText
        });

        if (response.status === 200) {
            const replyText = response.data;
            await bot.editMessageText(replyText, {
                chat_id: chatId,
                message_id: please.message_id
            });
        } else {
            throw new Error('متاسفانه خطایی رخ داده است.');
        }
    } catch (error) {
        await bot.editMessageText('متاسفانه خطایی رخ داده است.', {
            chat_id: chatId,
            message_id: please.message_id
        });
    }
});

bot.startPolling();
