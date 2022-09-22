import {
  arrow,
  computePosition,
  flip,
  offset,
  Placement,
  shift,
} from "@floating-ui/dom";
import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("simple-greeting")
export class SimpleGreeting extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
    #tooltip {
      display: none;

      position: absolute;
      top: 0;
      left: 0;
      background: #222;
      color: white;
      font-weight: bold;
      padding: 5px;
      border-radius: 4px;
      font-size: 90%;
      pointer-events: none;
    }

    #arrow {
      position: absolute;
      background: #333;
      width: 8px;
      height: 8px;
      transform: rotate(45deg);
    }
  `;

  @query("#first")
  _first: HTMLElement;

  @property()
  name = "Somebody";

  @property()
  placement: Placement = "top";

  firstUpdated() {
    //const button = this.shadowRoot.querySelector("slot");
    const button = this.renderRoot.querySelector("#content");

    const tooltip = this.renderRoot.querySelector("#tooltip") as HTMLElement;
    const arrowElement = this.renderRoot.querySelector("#arrow") as HTMLElement;

    const update = () => {
      computePosition(button, tooltip, {
        placement: this.placement,
        middleware: [
          offset(6),
          flip(),
          shift({ padding: 5 }),
          arrow({ element: arrowElement }),
        ],
      }).then(({ x, y, middlewareData, placement }) => {
        Object.assign(tooltip.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        // Accessing the data
        const { x: arrowX, y: arrowY } = middlewareData.arrow;

        const staticSide = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right",
        }[placement.split("-")[0]];

        Object.assign(arrowElement.style, {
          left: arrowX != null ? `${arrowX}px` : "",
          top: arrowY != null ? `${arrowY}px` : "",
          right: "",
          bottom: "",
          [staticSide]: "-4px",
        });
      });
    };
    console.log({ tooltip });
    function showTooltip() {
      tooltip.style.display = "block";
      update();
    }

    function hideTooltip() {
      tooltip.style.display = "";
    }

    (
      [
        ["mouseenter", showTooltip],
        ["mouseleave", hideTooltip],
        ["focus", showTooltip],
        ["blur", hideTooltip],
      ] as const
    ).forEach(([event, listener]) => {
      button.addEventListener(event, listener);
    });
  }

  render() {
    return html`
      <div id="content">
        <slot>I am fallback content</slot>
        <div>
          <div id="tooltip" role="tooltip">
            My tooltip
            <div id="arrow"></div>
          </div>
        </div>
      </div>
    `;
  }
}
