class Modal {
  constructor(
    target,
    options = { atOpening: () => null, atClosing: () => null }
  ) {
    this.atOpening = options.atOpening || (() => null);
    this.atClosing = options.atClosing || (() => null);
    this.target = target;
    this.modalReference = null;
  }

  insert() {
    const $target = document.querySelector(this.target);
    this.modalReference = document.createElement("div");
    this.modalReference.classList.add("modal");
    $target.appendChild(this.modalReference);

    return this.modalReference;
  }

  remove() {
    this.modalReference.remove();
  }

  insertChildren(children) {
    this.removeChildren();
    this.modalReference.appendChild(children);
  }

  removeChildren() {
    this.modalReference.innerHTML = "";
  }

  changeAnimation(animation) {
    if (!animation)
      return this.modalReference.removeAttribute("data-modal-animation");
    this.modalReference.dataset.modalAnimation = animation;
  }

  toggle() {
    this.modalReference.classList.toggle("modal--active");
  }

  open({ children, animation, next = () => null }) {
    this.insertChildren(children);
    this.changeAnimation(animation);
    setTimeout(() => this.modalReference.classList.add("modal--active"), 0);
    this.atOpening();
    next();
  }

  close({ timeout = 200, next = () => null }) {
    this.modalReference.classList.remove("modal--active");
    setTimeout(() => {
      this.removeChildren();
      this.changeAnimation(null);
    }, timeout);
    this.atClosing();
    next();
  }
}

export default Modal;
