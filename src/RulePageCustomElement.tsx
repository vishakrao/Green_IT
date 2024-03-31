import React, { Suspense } from "react"
import { Root, createRoot } from "react-dom/client"
import EkofestEngine from "./EkofestEngine"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

const RulePage = React.lazy(() => import("./RulePage.tsx"))

const reactRootId = "react-root"

export function defineCustomElementWith(engine: EkofestEngine) {
    customElements.define(
        "publicodes-rule-page",
        class extends HTMLElement {
            reactRoot: Root
            engine: EkofestEngine

            static observedAttributes = [
                "rule",
                "documentationPath",
                "situation",
            ]

            constructor() {
                super()
                this.reactRoot = createRoot(
                    document.getElementById(reactRootId) as HTMLElement
                )
                this.engine = engine
                this.renderElement()
            }

            connectedCallback() {
                this.renderElement()
            }

            attributeChangedCallback() {
                console.log("attributeChangedCallback")
                this.renderElement()
            }

            renderElement() {
                const rulePath = this.getAttribute("rule") ?? ""
                const documentationPath =
                    this.getAttribute("documentationPath") ?? ""

                if (!rulePath || !documentationPath) {
                    return null
                }

                this.reactRoot.render(
                    <Suspense fallback={<div>Loading...</div>}>
                        <RulePage
                            engine={this.engine}
                            rulePath={rulePath}
                            documentationPath={documentationPath}
                            language={"fr"}
                            searchBar={true}
                            renderers={{
                                Text: ({ children }) => (
                                    <Markdown
                                        className={"markdown"}
                                        remarkPlugins={[remarkGfm]}
                                    >
                                        {children}
                                    </Markdown>
                                ),
                                Link: ({ to, children }) => (
                                    <button
                                        className="link"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            this.engine
                                                .getElmApp()
                                                .ports.reactLinkClicked.send(to)
                                        }}
                                    >
                                        {children}
                                    </button>
                                ),
                            }}
                        />
                    </Suspense>
                )
            }
        }
    )
}
