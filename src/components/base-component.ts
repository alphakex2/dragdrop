
  //Component Base Class
 export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement
    hostElement: T
    element: U

    constructor(
      templateId: string,
      hostElId: string,
      insertAtStart: boolean,
      newElId?: string
    ) {
      this.templateElement = document.getElementById(
        templateId
      )! as HTMLTemplateElement
      this.hostElement = document.getElementById(hostElId)! as T

      const importedNode = document.importNode(
        this.templateElement.content,
        true
      )
      this.element = importedNode.firstElementChild as U
      if (newElId) {
        this.element.id = newElId
      }
      this.attach(insertAtStart)
    }

    private attach(insertAtBeginning: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtBeginning ? "afterbegin" : "beforeend",
        this.element
      )
    }

    abstract configure(): void
    abstract renderContent(): void
  }

