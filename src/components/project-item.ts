import { Component } from "./base-component"
import { Draggable } from "../models/drag-drop"
import { Project } from "../models/model"
import { autoBind } from "../decorators/autobind"

  export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable {
    private project: Project

    get persons() {
      if (this.project.people === 1) {
        return "1 Person"
      } else {
        return `${this.project.people} persons.`
      }
    }

    constructor(hostId: string, project: Project) {
      super("single-project", hostId, false, project.id)
      this.project = project
      this.configure()
      this.renderContent()
    }

    @autoBind
    dragStartHandler(e: DragEvent) {
      e.dataTransfer!.setData("text/plain", this.project.id)
      e.dataTransfer!.effectAllowed = "move"
    }

    dragEndHandler(e: DragEvent) {
      console.log("Drag end")
    }
    configure() {
      this.element.addEventListener("dragstart", this.dragStartHandler)
      this.element.addEventListener("dragend", this.dragEndHandler)
    }

    renderContent() {
      this.element.querySelector("h2")!.textContent = this.project.title
      this.element.querySelector("h3")!.textContent =
        this.persons + " assigned." //Using getter persons
      this.element.querySelector("p")!.textContent = this.project.description
    }
  }

