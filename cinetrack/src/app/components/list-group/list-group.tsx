"use client"

import {forwardRef} from 'react';
import {DEFAULT_ICON_SIZE, DISPLAY_NAME} from './list-group.constants';
import listGroupClassNames from './list-group.styles';
import type {
    ListGroupIconProps,
    ListGroupItemContentProps,
    ListGroupItemDescriptionProps,
    ListGroupItemPrefixProps,
    ListGroupItemProps,
    ListGroupItemSuffixProps,
    ListGroupItemTitleProps,
    ListGroupRootProps,
} from './list-group.types';
import {Surface} from '@heroui/react';
import {ChevronRightIcon} from '@heroicons/react/24/outline';
import {usePress} from "react-aria";

// --------------------------------------------------

const ListGroupRoot = forwardRef<HTMLDivElement, ListGroupRootProps>((props, ref) => {
    const {
        children, variant = 'default', className, style, ...restProps
    } = props;

    const rootClassName = listGroupClassNames.root({className});

    return (<Surface
        ref={ref}
        variant={variant}
        className={rootClassName}
        style={style}
        {...restProps}
    >
        {children}
    </Surface>);
});

// --------------------------------------------------

const ListGroupItem = forwardRef<HTMLButtonElement, ListGroupItemProps>((props, ref) => {
    const {children, className, disabled, onPress, ...restProps} = props;

    const itemClassName = listGroupClassNames.item({className});

    const {pressProps} = usePress({
        onPress,
        isDisabled: disabled
    });

    return (<button
        type='button'
        ref={ref}
        className={itemClassName}
        disabled={disabled}
        {...pressProps}
        {...restProps}
    >
        {children}
    </button>);
});

// --------------------------------------------------

const ListGroupItemPrefix = forwardRef<HTMLDivElement, ListGroupItemPrefixProps>((props, ref) => {
    const {children, className, ...restProps} = props;

    const prefixClassName = listGroupClassNames.itemPrefix({className});

    return (<div ref={ref} className={prefixClassName} {...restProps}>
        {children}
    </div>);
});

// --------------------------------------------------

const ListGroupItemContent = forwardRef<HTMLDivElement, ListGroupItemContentProps>((props, ref) => {
    const {children, className, style, ...restProps} = props;

    const contentClassName = listGroupClassNames.itemContent({className});

    return (<div ref={ref} className={contentClassName} style={style} {...restProps}>
        {children}
    </div>);
});

// --------------------------------------------------

const ListGroupItemTitle = forwardRef<HTMLSpanElement, ListGroupItemTitleProps>((props, ref) => {
    const {children, className, ...restProps} = props;

    const titleClassName = listGroupClassNames.itemTitle({className});

    return (<span ref={ref} className={titleClassName} {...restProps}>
                {children}
            </span>);
});

// --------------------------------------------------

const ListGroupItemDescription = forwardRef<HTMLSpanElement, ListGroupItemDescriptionProps>((props, ref) => {
    const {children, className, ...restProps} = props;

    const descriptionClassName = listGroupClassNames.itemDescription({
        className,
    });

    return (<span ref={ref} className={descriptionClassName} {...restProps}>
            {children}
        </span>);
});

// --------------------------------------------------

const ListGroupItemSuffix = forwardRef<HTMLDivElement, ListGroupItemSuffixProps>((props, ref) => {
    const {children, iconProps, ...restProps} = props;

    const resolvedIconProps: ListGroupIconProps = {
        size: iconProps?.size ?? DEFAULT_ICON_SIZE, color: iconProps?.color ?? 'currentColor',
    };

    return (<div ref={ref} {...restProps}>
        {children ?? (<ChevronRightIcon
            width={resolvedIconProps.size}
            height={resolvedIconProps.size}
            color={resolvedIconProps.color}
        />)}
    </div>);
});

// --------------------------------------------------

ListGroupRoot.displayName = DISPLAY_NAME.ROOT;
ListGroupItem.displayName = DISPLAY_NAME.ITEM;
ListGroupItemPrefix.displayName = DISPLAY_NAME.ITEM_PREFIX;
ListGroupItemContent.displayName = DISPLAY_NAME.ITEM_CONTENT;
ListGroupItemTitle.displayName = DISPLAY_NAME.ITEM_TITLE;
ListGroupItemDescription.displayName = DISPLAY_NAME.ITEM_DESCRIPTION;
ListGroupItemSuffix.displayName = DISPLAY_NAME.ITEM_SUFFIX;

/**
 * Compound ListGroup component with sub-components
 *
 * @component ListGroup - Surface-based container that groups related list items.
 * Supports all Surface variants (default, secondary, tertiary, transparent).
 *
 * @component ListGroup.Item - Horizontal flex-row container for a single item,
 * providing consistent spacing and alignment.
 *
 * @component ListGroup.ItemPrefix - Optional leading content slot for icons,
 * avatars, or other visual elements.
 *
 * @component ListGroup.ItemContent - Flex-1 wrapper for title and description,
 * occupying the remaining horizontal space.
 *
 * @component ListGroup.ItemTitle - Primary text label styled with foreground color
 * and medium font weight.
 *
 * @component ListGroup.ItemDescription - Secondary text styled with muted color
 * and smaller font size.
 *
 * @component ListGroup.ItemSuffix - Optional trailing content slot. Renders a
 * chevron-right icon by default; accepts children to override the default icon.
 * Supports iconProps (size, color) for customising the default chevron.
 *
 * @see Full documentation: https://heroui.com/docs/native/components/list-group
 */
const CompoundListGroup = Object.assign(ListGroupRoot, {
    /** @optional Single item row with flex-row layout */
    Item: ListGroupItem, /** @optional Leading visual element (icon / avatar) */
    ItemPrefix: ListGroupItemPrefix, /** @optional Flex-1 content wrapper for title and description */
    ItemContent: ListGroupItemContent, /** @optional Primary text label */
    ItemTitle: ListGroupItemTitle, /** @optional Secondary descriptive text */
    ItemDescription: ListGroupItemDescription, /** @optional Trailing element, defaults to chevron-right icon */
    ItemSuffix: ListGroupItemSuffix,
});

export default CompoundListGroup;