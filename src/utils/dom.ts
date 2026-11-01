/**
 * Returns the first element matching `selector` or throws — this keeps the
 * application free of non-null assertions and `as` casts on DOM queries.
 */
export function getElement<TElement extends Element>(selector: string, root: ParentNode = document): TElement {
    const element = root.querySelector<TElement>(selector);

    if (element === null) {
        throw new Error(`Element "${selector}" was not found in the document`);
    }

    return element;
}

/**
 * Returns every element matching `selector` as a real array, so it can be
 * iterated and mapped with ordinary array methods.
 */
export function getElements<TElement extends Element>(selector: string, root: ParentNode = document): TElement[] {
    return Array.from(root.querySelectorAll<TElement>(selector));
}

/**
 * Clones the content of a `<template>` element identified by `templateId`.
 */
export function cloneTemplate(templateId: string): DocumentFragment {
    const template = getElement<HTMLTemplateElement>(`#${templateId}`);
    const clone: Node = template.content.cloneNode(true);

    if (!(clone instanceof DocumentFragment)) {
        throw new Error(`Template "#${templateId}" does not contain a document fragment`);
    }

    return clone;
}
