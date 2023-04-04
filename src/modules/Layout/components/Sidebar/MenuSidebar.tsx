import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { Menu } from 'antd';
import type { MenuProps } from 'antd/es/menu';

import { Icon } from '@/components/Icon/Icon';

import { itemsMenu } from '@/constants/menu';

type MenuItem = Required<MenuProps>['items'][number];

interface Props {
    next: () => void;
}

function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    // children?: MenuItem[],
    disabled?: boolean
): MenuItem {
    return {
        key,
        icon,
        // children,
        label,
        disabled: disabled || false
    } as MenuItem;
}

const items = itemsMenu.map((item) =>
    getItem(<span>{item.title}</span>, item.router, item.icon, item.disabled)
);

// const items: MenuItem[] = [
//     getItem(<span>Trang chủ</span>, '/', <Icon name="dashboard" />),
//     getItem(<span>Kịch bản</span>, '/scheme', <Icon name="scheme" />),
//     getItem(<span>Quản lý màn hình</span>, '/monitor', <Icon name="monitor" />),
//     getItem(<span>Xem lại Video</span>, '/history-video', <Icon name="history-video" />, true),
//     getItem(
//         <span>Xem lại nhiều video</span>,
//         '/history-multi-video',
//         <Icon name="history-video" />,
//         true
//     )
// ];

export const MenuSidebar: FC<Props> = ({ next }) => {
    const router = useRouter();

    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line no-unsafe-optional-chaining
    const [, root, sub] = router.pathname?.split('/');

    //handle push for path
    const handleClick = ({ item, key, keyPath, domEvent }) => {
        router.push(key);
        next();
    };
    return (
        <Menu
            defaultSelectedKeys={['/']}
            selectedKeys={['/' + (sub && sub !== '[id]' ? sub : root)]}
            defaultOpenKeys={['/' + root]}
            mode="inline"
            theme="dark"
            style={{
                padding: '15px 0'
            }}
            onClick={handleClick}
            items={items}
            className="hanet-ant-menu-sidebar"
        />
    );
};

export default MenuSidebar;
