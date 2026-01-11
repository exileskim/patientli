import { getWpFile } from '@/lib/wp-content';

export function WpHeader({ htmlPath }: { htmlPath: string }) {
  const headerHtml = getWpFile(htmlPath);
  return <div dangerouslySetInnerHTML={{ __html: headerHtml }} />;
}
