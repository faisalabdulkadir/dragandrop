//Validatable
interface Validatable {
  value: string | number;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
}

function validate(validatableInput: Validatable): boolean {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value == "string"
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length >= validatableInput.minLength;
  }

  if (validatableInput.maxLength && typeof validatableInput.value == "string") {
    isValid =
      isValid &&
      validatableInput.value.trim().length <= validatableInput.maxLength;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value == "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (validatableInput.max && typeof validatableInput.value == "number") {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}

//Autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
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

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const enteredTitleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const enteredDescriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const enteredPeopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 5
    };

    if (
      !validate(enteredTitleValidatable) ||
      !validate(enteredDescriptionValidatable) ||
      !validate(enteredPeopleValidatable)
    ) {
      alert("Invalid input, please enter the correct data");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.htmlElement);
  }

  private configure() {
    this.htmlElement.addEventListener("submit", this.submitHandler);
  }
}

const projInput = new ProjectInput();
