const Tile = require("./Tile.js");

function Conversation(service, settings) {
    this.service = service;

    if (settings.state === "battle") {
        this.backgroundTile = this.service.resources.getTile("conversationBattleBg", 0, 768 - 192, 1024, 192);
    } else {
        this.backgroundTile = this.service.resources.getTile("conversationBg", 2, 768 - 185, 1022, 179);
    }

    this.arrowTile = this.service.resources.getTile("conversationArrow", 880, 768 - 192 + 50, 56, 80);
    this.arrowTile.alpha = 0;

    this.texts = ["+"];

    this.callables = [undefined];

    this.line1 = "";
    this.line2 = "";

    this.nextable = true;
}

/**
 * Add a text and callable to the conversation queue
 */
Conversation.prototype.enqueue = function(text, callable) {
    this.texts.push(text);

    this.callables.push(callable);
}

/**
 * Starts displaying the first text and callable in the queue
 */
Conversation.prototype.next = function() {
    // Remove the currently active
    this.texts.shift();
    this.callables.shift();

    // Call the callable
    if (this.callables[0] !== undefined) {
        this.callables[0]();
    }

    // Reset the lines
    this.line1 = "";
    this.line2 = "";
}

/**
 * Updates text 'animation' and determines if is typing
 */
Conversation.prototype._updateText = function() {
    let text = this.texts[0];

    if (text === undefined) {
        return;
    }

    // If the lines do not equal the currently active text -> add one new letter to a line
    if (this.line1 + "+" + this.line2 !== text) {
        // this.typing = true;

        // Determine what line to update
        let index = text.indexOf("+");

        if (text.substring(0, index) !== this.line1) {
            this.line1 += text[this.line1.length];
        } else {
            this.line2 += text[this.line1.length + this.line2.length + 1];
        }

        if (this.line1 + "+" + this.line2 !== text) {
            this.nextable = false;
        }
    }
}

Conversation.prototype.update = function() {
    if (this.texts[0] === "+") {
        return;
    }

    this.nextable = true;

    this._updateText();

    // If there is no next -> make conversaiton not nextable
    if (this.texts[1] === undefined) {
        this.nextable = false;
    }

    this.arrowTile.update();

    if (this.nextable === true) {
        this.arrowTile.alpha = 1;
    } else {
        this.arrowTile.alpha = 0;
    }

    // If clicked at conversation bar
    if (this.nextable === true && this.service.listeners.click && this.backgroundTile.pointerInside()) {
        this.next();

        this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/Choose.wav").play();
    }
}

Conversation.prototype.render = function(context) {
    if (this.texts[0] === "+") {
        return;
    }

    this.backgroundTile.render(context);

    this.arrowTile.render(context);

    context.save();

    context.beginPath();

    context.font = "30px 'ConversationFont'";
    context.fillStyle = "rgba(0,0,0,0.7)";
    context.shadowColor = "rgba(0,0,0,0.2)";
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 3;
    // context.shadowBlur = 3;

    context.fillText(this.line1, 70, 662);

    context.fillText(this.line2, 70, 717);

    context.restore();
}

module.exports = Conversation;
