export const cls = classes => {
  return Object.keys(classes)
    .filter(style => classes[style])
    .join(' ')
}
