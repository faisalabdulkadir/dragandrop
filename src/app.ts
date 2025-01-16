//Autobind decorator
function autobind(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  // console.log({ descriptor });
  const originalFn = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalFn.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

//Project Input class
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
    this.configure();
  }
  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputElement.value);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.htmlElement);
  }

  private configure() {
    this.htmlElement.addEventListener("submit", this.submitHandler);
  }
}

const projInput = new ProjectInput();
