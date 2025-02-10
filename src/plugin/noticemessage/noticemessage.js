import './noticemessage.css';
import i18n from 'i18next';


let noti_id = 0;
/* NoticeMessage v1.0.0 Zeki Jo 2022.06.17 */
export default class NoticeMessage {
  constructor(message, detailOptions) {
    // Checking NoticeMessage is created already.
    if (NoticeMessage.instance) {
      return console.warn("Warning: Message Box class already created");
    }
    NoticeMessage.instance = this;

    // Can changed by User's setting
    this._message = message === undefined ? "Empty Message" : message; // Content Text;
    this.options = detailOptions === undefined ? {} : detailOptions;
    this._debug = this.options.debug === undefined ? false : this.options.debug; // Debug Mode.
    this._mode = this.options.mode === undefined ? "normal" : this.options.mode; // MODE [normal (default) | confirm | prompt]
    this._header =
      this.options.header === undefined ? false : this.options.header; // header Mode.
    this._titleText =
      this.options.titleText === undefined ? "　" : this.options.titleText; // Title Text;
    this._footerText =
      this.options.footerText === undefined ? "　" : this.options.footerText; // Footer Text;
    this._background =
      this.options.background === undefined ? true : this.options.background; // Background setting
    this._draggable =
      this.options.draggable === undefined ? false : this.options.draggable; // draggable setting
    // i18n
    this._locale = this.options.locale === undefined ? true : this.options.locale; //
    this._i18n = this.options.i18n === undefined ? null : this.options.i18n;
    this._errmsg = this.options.errmsg === undefined ? null : this.options.errmsg;

    // Funtions
    const modeEvents = {
      confirm:
        this.options.confirmClicked === undefined
          ? false
          : this.options.confirmClicked,
      prompt:
        this.options.promptClicked === undefined
          ? false
          : this.options.promptClicked,
    };
    this._activateMode = modeEvents[this._mode];
    this._callback =
      this.options.callback === undefined ? false : this.options.callback;
    this._created =
      this.options.created === undefined ? false : this.options.created;

    // Not set by Options
    this._containerTemp = null;
    this._backgroundTemp = null;
    this.element = null;
    this.open();
  }

  // It will make Default Frames with initial setting data
  open() {
    noti_id++;
    // Background
    if (this._background) {
      const nm_background = document.createElement("div");
      nm_background.className = "nm_background";
      nm_background.addEventListener("click", () => {
        this.close();
      });
      this._backgroundTemp = nm_background;
      document.body.appendChild(nm_background);
    }

    // Whole Container
    const nm_container = document.createElement("div");
    nm_container.className = "nm_container";

    const nm_id = document.createElement("div");
    nm_id.id = `__noti__${noti_id}`;
    nm_id.style.display = 'none';
    nm_id.addEventListener("click", () => this.close());
    nm_container.appendChild(nm_id);
    this.pushSessionStorage(nm_id.id);

    // 1/3 => Header
    if (this._header) {
      const nm_header = document.createElement("div");
      nm_header.className = "nm_header";

      const nm_title = document.createElement("div");
      nm_title.className = "nm_title";
      if (this._titleText) {
        nm_title.textContent = this._titleText;
      }
      nm_header.appendChild(nm_title);

      const nm_close = document.createElement("button");
      nm_close.className = "nm_close";
      nm_close.id = "nm_close";
      nm_close.textContent = "X";
      nm_close.addEventListener("click", () => {
        this.close();
      });
      nm_header.appendChild(nm_close);

      nm_container.appendChild(nm_header);
    }

    // 2/3 => Section
    const nm_section = document.createElement("div");
    nm_section.className = "nm_section";

    const nm_content = document.createElement("div");
    nm_content.className = "nm_content";
    nm_content.textContent = this._message;
    // JQuery I18Next Libray
    if(this._message.includes('::')) {
      nm_content.dataset.i18n = this._message.substring(2).trim();
    } else {
      nm_content.dataset.i18n = this._i18n;
    }
    nm_section.appendChild(nm_content);

    if(this._errmsg) {
      const nm_content1 = document.createElement("div");
      nm_content1.className = "nm_content";
      nm_content1.textContent = this._errmsg;
      nm_content1.dataset.i18n = this._errmsg;
      nm_section.appendChild(nm_content1);
    }

    if (this._mode === "prompt") {
      const nm_input = document.createElement("input");
      nm_input.classList = "nm_input";
      nm_input.id = "nm_input";
      nm_section.appendChild(nm_input);
    }

    nm_container.appendChild(nm_section);

    // 3/3 => Footer
    const nm_footer = document.createElement("div");
    nm_footer.className = "nm_footer";

    // Footer - Text
    const nm_footer_text = document.createElement("div");
    nm_footer_text.className = "nm_footer_text";
    if (this._footerText) {
      nm_footer_text.textContent = this._footerText;
    }
    nm_footer.appendChild(nm_footer_text);

    // Footer - Buttons
    const nm_footer_btns = document.createElement("div");
    nm_footer_btns.classList = "nm_footer_button";

    const mode = this._mode;
    switch (mode) {
      case "confirm":
        this.createConfirmFooter(nm_footer_btns);
        break;
      case "prompt":
        this.createPromptFooter(nm_footer_btns);
        break;
      case "normal":
      default:
        this.createDefaultFooter(nm_footer_btns);
        break;
    }
    nm_footer.appendChild(nm_footer_btns);

    nm_container.appendChild(nm_footer);

    this._containerTemp = nm_container;
    document.body.appendChild(nm_container);
    if (this._draggable) {
      this.enableDrag(nm_container);
    }

    const focusBtnEl = document.querySelector(".nm_focus");
    focusBtnEl.focus();

    this.element = nm_container;

    if(this._message.includes('::')) {
      try {
        $(this.element).localize();
      } catch (e) {
        console.log('It requires JQuery, JQuery-I18Next + ', e);
      }
    } else if(this._created) {
      this._created();
    }

    // this.emit('messageCreated', {});
  }

  close() {
    if (this._background) {
      document.body.removeChild(this._backgroundTemp);
    }
    document.body.removeChild(this._containerTemp);
    if (this._callback) {
      this._callback();
    }
    this.emit("onClose", {});
    // this.instance = null;
    NoticeMessage.instance = null;
    this.popSessionStorage();
  }

  createDefaultFooter(dest) {
    const nm_footer_close = document.createElement("button");
    nm_footer_close.className = "nm_footer_btns nm_focus btn-md primary fill";
    nm_footer_close.id = "nm_footer_close";
    nm_footer_close.textContent = i18n.t('msg > confirm') !== 'msg > confirm' ? i18n.t('msg > confirm') : '확인';
    if (this._locale) {
      nm_footer_close.dataset.i18n = `msg > confirm`;
    }
    nm_footer_close.addEventListener("click", () => {
      this.close();
    });
    dest.appendChild(nm_footer_close);
  }

  createConfirmFooter(dest) {
    const nm_footer_confirm = document.createElement("button");
    nm_footer_confirm.className = "nm_footer_btns nm_focus btn-md primary fill";
    nm_footer_confirm.id = "nm_footer_confirm";
    nm_footer_confirm.textContent = i18n.t('msg > confirm') !== 'msg > confirm' ? i18n.t('msg > confirm') : '확인';
    if (this._locale) {
      nm_footer_confirm.dataset.i18n = `msg > confirm`;
    }
    dest.appendChild(nm_footer_confirm);

    const nm_footer_close = document.createElement("button");
    nm_footer_close.className = "nm_footer_btns btn-md primary no-fill";
    nm_footer_close.id = "nm_footer_close";
    nm_footer_close.textContent = i18n.t('msg > close');
    if (this._locale) {
      nm_footer_close.dataset.i18n = `msg > close`;
    }
    nm_footer_close.addEventListener("click", () => {
      this.close();
    });
    dest.appendChild(nm_footer_close);
  }

  createPromptFooter(dest) {
    const nm_footer_prompt = document.createElement("button");
    nm_footer_prompt.className = "nm_footer_btns nm_focus";
    nm_footer_prompt.id = "nm_footer_prompt";
    nm_footer_prompt.textContent = i18n.t('msg > confirm') !== 'msg > confirm' ? i18n.t('msg > confirm') : '확인';
    if (this._locale) {
      nm_footer_prompt.dataset.i18n = `msg > confirm`;
    }
    dest.appendChild(nm_footer_prompt);

    const nm_footer_close = document.createElement("button");
    nm_footer_close.className = "nm_footer_btns";
    nm_footer_close.id = "nm_footer_close";
    nm_footer_close.textContent = i18n.t('msg > close');
    if (this._locale) {
      nm_footer_close.dataset.i18n = `msg > close`;
    }
    nm_footer_close.addEventListener("click", () => {
      this.close();
    });
    dest.appendChild(nm_footer_close);
  }

  // [Event] Executed when 'confirm' button on Confirm NoticeMessage was clicked (It's Disposable)
  confirmClicked() {
    return new Promise((resolve, reject) => {
      const confirm = document.getElementById("nm_footer_confirm");
      confirm.addEventListener("click", () => {
        this.close();
        resolve();
      });
    });
  }

  // [Event] Executed when 'prompt' button on Prompt NoticeMessage was clicked (It's Disposable)
  promptClicked() {
    return new Promise((resolve, reject) => {
      const prompt = document.getElementById("nm_footer_prompt");
      prompt.addEventListener("click", () => {
        this.close();
        resolve();
      });
    });
  }

  enableDrag(el) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(el.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(el.id + "header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      el.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      el.style.top = el.offsetTop - pos2 + "px";
      el.style.left = el.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  on(event, handler) {
    this.element.addEventListener(event, function (e) {
      handler(e, e.detail);
    });
    return this;
  }

  emit(event, data) {
    const evt = new CustomEvent(event, { detail: data });
    this.element.dispatchEvent(evt);
    return this;
  }

  pushSessionStorage(item) {
    let _items = JSON.parse(sessionStorage.getItem("openedModals"));
    if (_items === null) { _items = []; }
    _items.push(item);
    sessionStorage.setItem("openedModals", JSON.stringify(_items));
  }
  popSessionStorage() {
    const _items = JSON.parse(sessionStorage.getItem("openedModals"));
    const lastItem = _items.pop();
    sessionStorage.setItem("openedModals", JSON.stringify(_items));
    return lastItem;
  }

  static setInstance(format) {
    return (this.instance = format);
  }

  static getInstance() {
    if (!this.instance) {
      console.log("Notice Message already exists.");
      return true;
    }
    return false;
  }
}
