const Tile = require("./Tile.js");

function Conversation(service, settings) {
    this.service = service;

    this.backgroundTile = this.service.resources.getTile("conversationBg", 0, 768 - 180 - 5, 1024, 180);

    this.nextbtnTile = this.service.resources.getTile("conversationNextbtn", 840, 610, 120, 120);

    this.texts = ["+"];

    this.line1 = "";
    this.line2 = "";

    this.textsIndex = 0;

    this.callable = null;

    // Hides the covnversation, do not render the converation if true
    this.hidden = settings.hidden;

    this.typing = false;

    this.nextable = settings.nextable;
}

// Shows the next text
Conversation.prototype.next = function() {
    // Do not go to next text if current text is still typing
    if (this.typing === true || this.nextable === false) {
        return;
    }

    if (this.callable) {
        this.callable();
        this.callable = null;
    }

    // Do not allow to go to next if next text is undefined!
    if (this.texts[this.textsIndex + 1] !== undefined) {
        this.textsIndex += 1;
    }

    this.line1 = "";
    this.line2 = "";
}

Conversation.prototype.addText = function(text) {
    this.texts.push(text);
}

/**
 * Adds a callable to be called when next is called
 */
Conversation.prototype.addCallable = function(callable) {
    this.callable = callable;
}

/**
 * Updates text 'animation' and determines if is typing
 */
Conversation.prototype._updateText = function() {
    if (this.line1 + "+" + this.line2 !== this.texts[this.textsIndex]) {
        this.typing = true;

        let index = this.texts[this.textsIndex].indexOf("+");

        if (this.texts[this.textsIndex].substring(0, index) !== this.line1) {
            this.line1 += this.texts[this.textsIndex][this.line1.length];
        } else {
            this.line2 += this.texts[this.textsIndex][this.line1.length + this.line2.length + 1];
        }

        if (this.line1 + "+" + this.line2 === this.texts[this.textsIndex]) {
            this.typing = false;
        }
    }
}

Conversation.prototype.update = function() {
    this._updateText();

    if (this.typing === true || this.nextable === false) {
        this.nextbtnTile.setFrame(0);
    } else {
        this.nextbtnTile.setFrame(1);
    }

    let x = this.service.listeners.mousePositionX;
    let y = this.service.listeners.mousePositionY;

    // If clicked at conversation bar
    if (this.service.listeners.click && this.backgroundTile.pointerInside()) {
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
