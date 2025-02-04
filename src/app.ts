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

//Project Type
enum ProjectStatus {
  Active,
  Finished,
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

//Project state Management
type Listener = (items: Project[]) => void;

class ProjectState {
  private projects: Project[] = [];
  private static instance: ProjectState;
  private listeners: Listener[] = [];

  private constructor() {}

  static getProjectState() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  public addProject(
    title: string,
    description: string,
    numberOfPeople: number
  ) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numberOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getProjectState();

//Project List class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  htmlElement: HTMLElement;
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = [];

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.htmlElement = importedNode.firstElementChild as HTMLElement;
    this.htmlElement.id = `${this.type}-projects`;

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-project-lists`
    )! as HTMLUListElement;
    const listItem = document.createElement("li");
    for (const projItem of this.assignedProjects) {
      listItem.textContent = projItem.title;
      listEl.append(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-project-lists`;
    this.htmlElement.querySelector("ul")!.id = listId;
    this.htmlElement.querySelector("h2")!.textContent =
      `${this.type} PROJECTS`.toUpperCase();
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.htmlElement);
  }
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
    this.htmlElement = importedNode.firstElementChild as HTMLFormElement;
    this.htmlElement.id = ``;

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
      max: 5,
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
      projectState.addProject(title, desc, people);
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
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
