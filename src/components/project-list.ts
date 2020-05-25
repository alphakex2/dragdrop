import { DragTarget } from "./../models/drag-drop.js"
import { Component } from "./base-component.js"
import { Project, ProjectStatus } from "../models/model.js"
import { ProjectItem } from "./project-item.js"
import { autoBind } from "../decorators/autobind.js"
import { projectState } from "../state/project-state.js"

export class ProjectList extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget {
  assignedProjects: Project[]

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`)

    this.hostElement = document.getElementById("app")! as HTMLDivElement
    this.assignedProjects = []

    this.configure()
    this.renderContent()
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement
    listEl.innerHTML = "" //clear before rendering
    this.assignedProjects.map((prjItem) => {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem)
    })
  }

  @autoBind
  dragOverHandler(e: DragEvent) {
    if (e.dataTransfer && e.dataTransfer.types[0] === "text/plain") {
      e.preventDefault() //Default is to not allow dropping
      const listEl = this.element.querySelector("ul")!
      listEl.classList.add("droppable")
    }
  }
  @autoBind
  dropHandler(e: DragEvent) {
    const projId = e.dataTransfer!.getData("text/plain")
    projectState.moveProject(
      projId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    )
  }

  @autoBind
  dragLeaveHandler(e: DragEvent) {
    const listEl = this.element.querySelector("ul")!
    listEl.classList.remove("droppable")
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler)
    this.element.addEventListener("dragleave", this.dragLeaveHandler)
    this.element.addEventListener("drop", this.dropHandler)

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active
        }
        return prj.status === ProjectStatus.Finished
      })
      this.assignedProjects = relevantProjects
      this.renderProjects()
    })
  }
  renderContent() {
    const listId = `${this.type}-projects-list`
    this.element.querySelector("ul")!.id = listId
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS"
  }
}
