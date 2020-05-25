import { Component } from "./base-component.js"
import { Validatable, validate } from "./../util/validation.js"
import { autoBind } from "./../decorators/autobind.js"

import { projectState } from "./../state/project-state.js"

export class ProjectInput extends Component<HTMLDivElement, HTMLElement> {
  titleInEl: HTMLInputElement
  descriptionInEl: HTMLInputElement
  peopleInEl: HTMLInputElement

  constructor() {
    super("project-input", "app", true, "user-input")

    this.titleInEl = this.element.querySelector("#title") as HTMLInputElement
    this.peopleInEl = this.element.querySelector("#people") as HTMLInputElement
    this.descriptionInEl = this.element.querySelector(
      "#description"
    ) as HTMLInputElement

    this.configure()
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler) // instead of .bind(this) use a decorator
  }
  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInEl.value
    const enteredDescription = this.descriptionInEl.value
    const enteredPeople = this.peopleInEl.value

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    }
    const descValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    }
    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 5,
    }
    if (
      !validate(titleValidatable) ||
      !validate(descValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input please try again")
      return
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]
    }
  }

  private clearInputs() {
    this.titleInEl.value = ""
    this.descriptionInEl.value = ""
    this.peopleInEl.value = ""
  }

  @autoBind //Binds this
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput
      projectState.addProject(title, desc, people)
      this.clearInputs()
    }
  }
}
