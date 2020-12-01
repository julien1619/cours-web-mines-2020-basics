import $ from "jquery";
import ky from "ky";
import { format, formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

type Message = {
  author: string;
  content: string;
  timestamp: number;
};

function getMessageView(message: Message) {
  const date = new Date(message.timestamp);
  const formattedDate = format(date, "PPPPp", { locale: fr });
  const dateDistance = formatDistance(date, new Date(), {
    locale: fr,
  });

  return `<div class="card my-3">
  <div class="card-body">
    <p class="card-text">${message.content}</p>
  </div>
  <div class="card-footer text-muted text-right">
    Par <span class="author">${message.author}</span>, ${formattedDate}, il y a ${dateDistance}
  </div>
</div>`;
}

function displayMessages(messages: Message[]) {
  const $messagesContainer = $(".messages-container");

  // Clear list content on view
  $messagesContainer.empty();

  // Iterate on messages and display getMessageView(message);
  $messagesContainer.append(
    messages.map((message) => getMessageView(message)).join()
  );
}

async function refreshMessages() {
  let pageIndex = 0;
  let hasMessages = true;
  let messages: Message[] = [];

  while (hasMessages) {
    // GET https://ensmn.herokuapp.com/messages
    // eslint-disable-next-line
    const pageMessages: Message[] = await ky
      .get(`https://ensmn.herokuapp.com/messages?page=${pageIndex}`)
      .json();

    hasMessages = pageMessages.length > 0;
    pageIndex += 1;
    messages = messages.concat(pageMessages);
  }

  displayMessages(messages.reverse());
}

refreshMessages();

setInterval(() => {
  refreshMessages();
}, 5000);

function sendMessage(message: MessageCreation) {
  // POST https://ensmn.herokuapp.com/messages (username, message)
  ky.post("https://ensmn.herokuapp.com/messages", { json: message }).then(() =>
    refreshMessages()
  );
}

type MessageCreation = {
  username?: string;
  message?: string;
};

// Listen "submit" event from form#message-form in body
$("body").on("submit", "#message-form", (event) => {
  // Stop default form submission
  event.preventDefault();

  // Get <form id="message-form">
  const $form = $("#message-form");

  // Retrieve data from form
  const data = $form.serializeArray();

  const messageData: MessageCreation = {};
  data.forEach(({ name, value }) => {
    messageData[name] = value;
  });

  // Validate data
  if (
    messageData.username == null ||
    messageData.username.length === 0 ||
    messageData.message == null ||
    messageData.message.length === 0
  ) {
    return;
  }

  sendMessage(messageData);

  $("#message").val("");
});
