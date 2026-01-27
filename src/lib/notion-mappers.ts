
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
    case 'to_do':
      content = rawBlock[type]?.rich_text;
      if (type === 'to_do') {
        content = {
          rich_text: rawBlock.to_do.rich_text,
          checked: rawBlock.to_do.checked,
        };
      }
      break;
    case 'code':
      content = {
        rich_text: rawBlock.code?.rich_text,
        language: rawBlock.code?.language,
        caption: rawBlock.code?.caption,
      };
      break;
    case 'image':
      content = {
        url: rawBlock.image?.type === 'external' 
          ? rawBlock.image.external.url 
          : rawBlock.image?.file?.url,
        caption: rawBlock.image?.caption,
      };
      break;
    case 'callout':
      content = {
        rich_text: rawBlock.callout?.rich_text,
        icon: rawBlock.callout?.icon?.emoji || rawBlock.callout?.icon?.external?.url,
        color: rawBlock.callout?.color,
      };
      break;
    case 'equation':
      content = rawBlock.equation?.expression;
      break;
    case 'bookmark':
      content = {
        url: rawBlock.bookmark?.url,
        caption: rawBlock.bookmark?.caption,
      };
      break;
    case 'video':
    case 'file':
    case 'pdf':
    case 'audio':
      content = {
        url: rawBlock[type]?.type === 'external' 
          ? rawBlock[type].external.url 
          : rawBlock[type]?.file?.url,
        caption: rawBlock[type]?.caption,
      };
      break;
    case 'table_of_contents':
      content = rawBlock.table_of_contents;
      break;
    case 'breadcrumb':
    case 'embed':
      content = type === 'breadcrumb' ? null : rawBlock.embed;
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
    has_children: rawBlock.has_children,
    is_toggleable: rawBlock[type]?.is_toggleable,
    children: rawBlock.children?.map(mapNotionBlock),
  };
}

/**
 * Interface for a full post with its content blocks
 */
export interface FullPost extends NotionPage {
  blocks: NotionBlock[];
}
