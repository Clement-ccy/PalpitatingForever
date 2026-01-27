
import { 
  getRichText, 
  getTitle, 
  getCover, 
  NotionPage, 
  NotionBlock 
} from './notion-utils';

/**
 * Maps a raw Notion Block object to a clean NotionBlock interface
 */
export function mapNotionBlock(rawBlock: any): NotionBlock {
  const type = rawBlock.type;
  let content: any = null;

  switch (type) {
    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
    case 'paragraph':
    case 'bulleted_list_item':
    case 'numbered_list_item':
    case 'quote':
    case 'toggle':
      content = getRichText(rawBlock[type]?.rich_text);
      break;
    case 'code':
      content = {
        text: getRichText(rawBlock.code?.rich_text),
        language: rawBlock.code?.language,
        caption: getRichText(rawBlock.code?.caption),
      };
      break;
    case 'image':
      content = {
        url: rawBlock.image?.type === 'external' 
          ? rawBlock.image.external.url 
          : rawBlock.image?.file?.url,
        caption: getRichText(rawBlock.image?.caption),
      };
      break;
    case 'callout':
      content = {
        text: getRichText(rawBlock.callout?.rich_text),
        icon: rawBlock.callout?.icon?.emoji || rawBlock.callout?.icon?.external?.url,
        color: rawBlock.callout?.color,
      };
      break;
    case 'equation':
      content = rawBlock.equation?.expression;
      break;
    case 'divider':
      content = null;
      break;
    default:
      content = rawBlock[type];
  }

  return {
    id: rawBlock.id,
    type,
    content,
  };
}

/**
 * Interface for a full post with its content blocks
 */
export interface FullPost extends NotionPage {
  blocks: NotionBlock[];
}
