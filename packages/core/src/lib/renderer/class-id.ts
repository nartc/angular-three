export const enum NgtRendererClassId {
    // common
    type = 0,
    parent,
    children,
    removed,
    comments,

    // instance
    compound,
    localState,
    compoundParent,
    rawValue,
    ref,

    // comment and portal
    injectorFactory,
    container,

    // compound
    compounded,
    queueOps,
    cleanUps,
    attributes,
    properties,
}

export const enum NgtRendererCompoundClassId {
    applyFirst,
    props,
}
