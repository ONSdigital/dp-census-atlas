import tippy, { type Props } from "tippy.js";

export function tooltip(node: HTMLElement, params: Partial<Props> = {}) {
  // determine the title to show - prefer the custom content first,
  // then the HTML title attribute then the aria-label
  const custom = params.content;
  const title = node.title;
  const label = node.getAttribute("aria-label");
  const content = custom?.toString() || title || label;

  if (content) {
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute
    if (!label) node.setAttribute("aria-label", content);

    // we don't want the default behaviour of HTML title showing up on hover
    node.title = "";

    // support any of the Tippy options by forwarding all params
    // https://atomiks.github.io/tippyjs/v6/all-props/
    const tip = tippy(node, { content, ...params });

    return {
      // if the props change, update the Tippy instance
      update: (newerParams: any) => {
        tip.setProps({ content, ...newerParams });
      },

      // clean up the Tippy instance
      destroy: () => tip.destroy(),
    };
  }
}
