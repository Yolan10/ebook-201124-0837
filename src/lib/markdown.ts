import { marked } from 'marked';

export const convertMarkdownToHtml = (markdown: string): string => {
  const renderer = new marked.Renderer();
  
  renderer.heading = (text, level) => {
    const className = `text-${level === 1 ? '3xl' : level === 2 ? '2xl' : 'xl'} font-bold mb-4 text-left`;
    return `<h${level} class="${className}">${text}</h${level}>`;
  };

  renderer.paragraph = (text) => {
    return `<p class="mb-4 leading-relaxed text-left">${text}</p>`;
  };

  renderer.list = (body, ordered) => {
    const type = ordered ? 'ol' : 'ul';
    const className = 'mb-4 pl-5 space-y-2 text-left';
    return `<${type} class="${className}">${body}</${type}>`;
  };

  renderer.listitem = (text) => {
    return `<li class="leading-relaxed text-left">${text}</li>`;
  };

  renderer.strong = (text) => {
    return `<strong class="font-bold">${text}</strong>`;
  };

  marked.setOptions({
    renderer,
    gfm: true,
    breaks: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
  });

  return marked(markdown);
};