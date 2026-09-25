// Smooth-scroll helper with fixed navbar height offset
const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;

  // Fixed header height (navbar + top utility bar offset)
  const headerOffset = 90;
  const elementPosition = el.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

export default scrollToId;
