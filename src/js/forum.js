import $ from "jquery";
import ky from "ky";

function getMessageView(message) {
  return `<div class="card my-3">
  <div class="card-body">
    <p class="card-text">${message.content}</p>
  </div>
  <div class="card-footer text-muted text-right">
    Par ${message.author}, le 30 novembre 2020
  </div>
</div>`;
}

function displayMessages(messages) {
  const $messagesContainer = $(".messages-container");

  // Clear list content on view
  $messagesContainer.empty();

  // Iterate on messages and display getMessageView(message);
  $messagesContainer.append(messages.map((message) => getMessageView(message)));
}

async function refreshMessages() {
  let pageIndex = 0;
  let hasMessages = true;
  let messages = [];

  while (hasMessages) {
    // GET https://ensmn.herokuapp.com/messages
    // eslint-disable-next-line
    const pageMessages = await ky
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

function sendMessage(message) {
  // POST https://ensmn.herokuapp.com/messages (username, message)
  ky.post("https://ensmn.herokuapp.com/messages", { json: message }).then(() =>
    refreshMessages()
  );
}

// Listen "submit" event from form#message-form in body
$("body").on("submit", "#message-form", (event) => {
  // Stop default form submission
  event.preventDefault();

  // Get <form id="message-form">
  const $form = $("#message-form");

  // Retrieve data from form
  const data = $form.serializeArray();

  const messageData = {};
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
