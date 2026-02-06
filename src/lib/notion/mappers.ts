import type { NotionBlock } from './types';

/**
 * Maps a raw Notion Block object to a clean NotionBlock interface
 */
type RawNotionBlock = {
  id: string;
  type: string;
  has_children?: boolean;
  children?: RawNotionBlock[];
} & Record<string, unknown>;

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const isRawNotionBlock = (value: unknown): value is RawNotionBlock => {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' && typeof value.type === 'string';
};

export function mapNotionBlock(rawBlock: unknown): NotionBlock {
  if (!isRawNotionBlock(rawBlock)) {
    return {
      id: 'unknown',
      type: 'unknown',
      content: null,
    };
  }

  const type = rawBlock.type;
  let content: unknown = null;
  const asRecord = (value: unknown): Record<string, unknown> => (
    value && typeof value === 'object' ? value as Record<string, unknown> : {}
  );
  const asString = (value: unknown): string | undefined => (
    typeof value === 'string' ? value : undefined
  );
  const blockValue = asRecord(rawBlock[type]);

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
      content = blockValue.rich_text;
      if (type === 'to_do') {
        const todoValue = asRecord(rawBlock.to_do);
        content = {
          rich_text: todoValue.rich_text ?? [],
          checked: Boolean(todoValue.checked),
        };
      }
      break;
    case 'code': {
      const codeValue = asRecord(rawBlock.code);
      content = {
        rich_text: codeValue.rich_text ?? [],
        language: asString(codeValue.language),
        caption: codeValue.caption ?? [],
      };
      break;
    }
    case 'image': {
      const imageValue = asRecord(rawBlock.image);
      const imageType = asString(imageValue.type);
      const imageExternal = asRecord(imageValue.external);
      const imageFile = asRecord(imageValue.file);
      content = {
        url: imageType === 'external'
          ? asString(imageExternal.url)
          : asString(imageFile.url),
        caption: imageValue.caption ?? [],
      };
      break;
    }
    case 'callout': {
      const calloutValue = asRecord(rawBlock.callout);
      const calloutIcon = asRecord(calloutValue.icon);
      const calloutExternal = asRecord(calloutIcon.external);
      content = {
        rich_text: calloutValue.rich_text ?? [],
        icon: asString(calloutIcon.emoji) ?? asString(calloutExternal.url),
        color: asString(calloutValue.color),
      };
      break;
    }
    case 'equation':
      content = asRecord(rawBlock.equation).expression;
      break;
    case 'bookmark': {
      const bookmarkValue = asRecord(rawBlock.bookmark);
      content = {
        url: asString(bookmarkValue.url),
        caption: bookmarkValue.caption ?? [],
      };
      break;
    }
    case 'video':
    case 'file':
    case 'pdf':
    case 'audio': {
      const mediaValue = asRecord(rawBlock[type]);
      const mediaType = asString(mediaValue.type);
      const mediaExternal = asRecord(mediaValue.external);
      const mediaFile = asRecord(mediaValue.file);
      content = {
        url: mediaType === 'external'
          ? asString(mediaExternal.url)
          : asString(mediaFile.url),
        caption: mediaValue.caption ?? [],
      };
      break;
    }
    case 'table_of_contents':
      content = rawBlock.table_of_contents ?? null;
      break;
    case 'table': {
      const tableValue = asRecord(rawBlock.table);
      content = {
        has_column_header: Boolean(tableValue.has_column_header),
        has_row_header: Boolean(tableValue.has_row_header),
      };
      break;
    }
    case 'table_row': {
      const rowValue = asRecord(rawBlock.table_row);
      content = {
        cells: rowValue.cells ?? [],
      };
      break;
    }
    case 'breadcrumb':
    case 'embed':
      content = type === 'breadcrumb' ? null : rawBlock.embed ?? null;
      break;
    case 'divider':
      content = null;
      break;
    default:
      content = rawBlock[type] ?? null;
  }

  const children = Array.isArray(rawBlock.children)
    ? rawBlock.children.filter(isRawNotionBlock)
    : [];

  return {
    id: rawBlock.id,
    type,
    content,
    has_children: rawBlock.has_children,
    is_toggleable: Boolean(asRecord(blockValue).is_toggleable),
    children: children.map(mapNotionBlock),
  };
}

/**
 * Interface for a full post with its content blocks
 */
