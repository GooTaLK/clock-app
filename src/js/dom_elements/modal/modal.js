class Modal {
  constructor(target) {
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
}

export default Modal;
