// ==UserScript==
// @name            Twitch - hitsquadgodfather
// @namespace       long-hoang.name.vn
// @version         0.0.1
// @description     🤖 Auto send chat commands on button click!
// @description:vi  🤖 Tự động gửi lệnh trò chuyện khi nhấp vào nút!
// @author          ngoclong19
// @match           https://www.twitch.tv/hitsquadgodfather
// @icon            https://www.google.com.vn/s2/favicons?sz=64&domain=twitch.tv
// @grant           none
// @source          https://github.com/ngoclong19/userscript
// ==/UserScript==

// References
// https://github.com/night/betterttv/blob/d97e5b7790ea05ee4db557b0456ddf00c2c88898/src/modules/emote_menu/twitch/EmoteMenu.jsx
// https://github.com/night/betterttv/blob/47e4083decf3880ea094b82d31278b6beec13bb8/src/utils/twitch.js

(function () {
  'use strict';

  const CHAT_CONTAINER =
    'section[data-test-selector="chat-room-component-layout"]';
  const CHAT_SETTINGS_BUTTON_CONTAINER_SELECTOR =
    '.chat-input div[data-test-selector="chat-input-buttons-container"]';
  const MSG_INTERVAL = 1500;

  const getReactInstance = (element) => {
    for (const key in element) {
      if (key.startsWith('__reactInternalInstance$')) {
        return element[key];
      }
    }

    return null;
  };

  const searchReactParents = (node, predicate, maxDepth = 15, depth = 0) => {
    try {
      if (predicate(node)) {
        return node;
      }
    } catch (_) {}

    if (!node || depth > maxDepth) {
      return null;
    }

    const { return: parent } = node;
    if (parent) {
      return searchReactParents(parent, predicate, maxDepth, depth + 1);
    }

    return null;
  };

  const getCurrentChat = () => {
    let currentChat;
    try {
      const node = searchReactParents(
        getReactInstance(document.querySelector(CHAT_CONTAINER).firstChild),
        (n) =>
          n.stateNode && n.stateNode.props && n.stateNode.props.onSendMessage
      );
      currentChat = node.stateNode;
    } catch (_) {}

    return currentChat;
  };

  const sendChatMessage = (message) => {
    const currentChat = getCurrentChat();
    if (!currentChat) return;
    currentChat.props.onSendMessage(message);
  };

  const clickHandler = async () => {
    sendChatMessage('!hitsquad');
    await new Promise((r) => setTimeout(r, MSG_INTERVAL));
    sendChatMessage('!battleroyale');
    await new Promise((r) => setTimeout(r, MSG_INTERVAL));
    sendChatMessage('!gauntlet');
  };

  const container = document.querySelector(
    CHAT_SETTINGS_BUTTON_CONTAINER_SELECTOR
  );
  if (container == null) {
    console.log('`container` not found');
    return;
  }
  const rightContainer = container.lastChild;
  const buttonContainer = document.createElement('div');
  rightContainer.insertBefore(buttonContainer, rightContainer.firstChild);

  const button = document.createElement('button');
  button.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M320 0c17.7 0 32 14.3 32 32V96H480c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256c0-22.1-17.9-40-40-40s-40 17.9-40 40s17.9 40 40 40s40-17.9 40-40zm152 40c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40s17.9 40 40 40zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"/></svg>';
  button.style.width = button.style.height = '2rem';
  button.firstChild.style.fill = 'currentcolor';
  button.onclick = clickHandler;

  buttonContainer.append(button);
})();
