import { getWpFile } from '@/lib/wp-content';

export function WpFooter({ htmlPath }: { htmlPath: string }) {
  const footerHtml = getWpFile(htmlPath);
  return <div dangerouslySetInnerHTML={{ __html: footerHtml }} />;
}
