export const openAllLinks = (links) => {
  console.log(links);
  if (links.length > 5) {
    const confirmed = window.confirm(
      `This will open ${links.length} tabs. Continue? Please allow pop-ups if your browser asks!`
    );
    if (!confirmed) return;
  }

  links.forEach((link, index) => {
    setTimeout(() => {
      window.open(link.url, "_blank");
    }, index * 50);
  });
};
