'use client';
import * as React from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Root> {
    src: string;
    alt?: string;
    fallback?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeMap = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-24 h-24 text-4xl',
};

export function Avatar({ src, alt, fallback, size = 'md', className = '', ...props }: AvatarProps) {
    return (
        <RadixAvatar.Root
            className={`inline-flex items-center justify-center align-middle select-none rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden ${sizeMap[size]} ${className}`}
            {...props}
        >
            <RadixAvatar.Image className="w-full h-full object-cover rounded-full" src={src} alt={alt} />
            <RadixAvatar.Fallback className="w-full h-full flex items-center justify-center font-bold bg-neutral-200 dark:bg-neutral-800 rounded-full">
                {fallback}
            </RadixAvatar.Fallback>
        </RadixAvatar.Root>
    );
}
