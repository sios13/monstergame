const Tile = require("./Tile.js");

function Conversation(service, settings) {
    this.service = service;

    this.backgroundTile = this.service.resources.getTile("conversationBg", 0, 768 - 192, 1024, 192);

    this.nextbtnTile = this.service.resources.getTile("conversationNextbtn", 840, 610, 120, 120);

    this.texts = ["+"];

    this.callables = [undefined];

    this.line1 = "";
    this.line2 = "";

    // Hides the covnversation, do not render the converation if true
    this.hidden = settings.hidden ? settings.hidden : false;

    // this.typing = false;
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
    this.nextable = true;

    this._updateText();

    // If there is no next -> disable next
    if (this.texts[1] === undefined) {
        this.nextable = false;
    }

    if (this.nextable === false) {
        this.nextbtnTile.setFrame(0);
    } else {
        this.nextbtnTile.setFrame(1);
    }

    // If clicked at conversation bar
    if (this.nextable === true && this.service.listeners.click && this.backgroundTile.pointerInside()) {
        this.next();
    }
}

Conversation.prototype.render = function(context) {
    // Do not render if conversation should be hidden
    if (this.hidden === true) {
        return;
    }

    this.backgroundTile.render(context);

    this.nextbtnTile.render(context);

    context.font = "30px 'Press Start 2P'";
    context.fillStyle = "rgba(0,0,0,0.8)";
    context.fillText(this.line1, 75, 660);

    context.font = "30px 'Press Start 2P'";
    context.fillStyle = "rgba(0,0,0,0.8)";
    context.fillText(this.line2, 75, 720);
}

module.exports = Conversation;
