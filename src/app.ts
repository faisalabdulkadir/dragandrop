class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  htmlElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.htmlElement = importedNode.querySelector("form") as HTMLFormElement;
    this.htmlElement.id = "user-input";

    this.titleInputElement = this.htmlElement.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.htmlElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.htmlElement.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.attach();
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.htmlElement);
  }
}

const projInput = new ProjectInput();
