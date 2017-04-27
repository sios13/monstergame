const Tile = require("./Tile.js");

function Conversation(settings) {
    this.tile = new Tile({
        renderX: 0,
        renderY: 583,
        renderWidth: 1028,
        renderHeight: 179,
        tileWidth: 1028,
        tileHeight: 179,
        src: settings.backgroundSrc,
    });

    this.texts = ["+"];

    this.line1 = "";
    this.line2 = "";

    this.textsIndex = 0;

    this.callable = null;

    this.nextBtn = new Tile({
        renderX: 840,
        renderY: 610,
        renderWidth: 120,
        renderHeight: 120,
        tileWidth: 120,
        tileHeight: 120,
        offset: 120,
        numberOfFrames: 2,
        src: "img/conversation/nextBtn.png",
        loop: false,
        pause: true
    });

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

Conversation.prototype.update = function(game) {
    this._updateText();

    if (this.typing === true || this.nextable === false) {
        this.nextBtn.setFrame(0);
    } else {
        this.nextBtn.setFrame(1);
    }

    let x = game.listeners.mousePositionX;
    let y = game.listeners.mousePositionY;

    // If clicked at conversation bar
    if (game.listeners.click === true && x > 0 && x < 1028 && y > 576 && y < 768) {
        this.next();
    }
}

Conversation.prototype.render = function(context) {
    // Do not render if conversation should be hidden
    if (this.hidden === true) {
        return;
    }

    this.tile.render(context);

    this.nextBtn.render(context);

    context.font = "30px 'Press Start 2P'";
    context.fillStyle = "rgba(0,0,0,0.8)";
    context.fillText(this.line1, 75, 660);

    context.font = "30px 'Press Start 2P'";
    context.fillStyle = "rgba(0,0,0,0.8)";
    context.fillText(this.line2, 75, 720);
}

module.exports = Conversation;
