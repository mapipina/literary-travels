import { createTheme, rem, Badge, Button, Card, Paper, Title, NavLink } from '@mantine/core';

export const theme = createTheme({
    colors: {
        navy: [
            '#eef2f7', '#d9e2ee', '#b3c5dd', '#8da8cc', '#668bbb', 
            '#406eaa', '#335888', '#1a2b49', '#15223a', '#0a111d'
        ],
        gold: [
            '#faf7f0', '#f1ecd9', '#e3d9b3', '#d5c58d', '#c7b267', 
            '#c5a059', '#9e8047', '#756035', '#4e4023', '#272012'
        ],
    },

    primaryColor: 'navy',
    primaryShade: 7,
    defaultRadius: 'sm',
    fontFamily: 'Inter, system-ui, sans-serif',

    components: {
        Card: Card.extend({
            defaultProps: {
                shadow: 'sm',
                padding: 'xl',
                withBorder: true,
            },
            styles: (theme) => ({
                root: {
                    transition: 'transform 200ms ease, box-shadow 200ms ease',
                    borderLeft: `${rem(4)} solid ${theme.colors.gold[5]}`, 
                    '&:hover': {
                        transform: `translateY(${rem(-4)})`,
                        boxShadow: 'var(--mantine-shadow-md)',
                    },
                },
            }),
        }),

        Button: Button.extend({
            defaultProps: {
                radius: 'md',
                loaderProps: { type: 'dots' },
                color: 'gold.5',
            },
            styles: {
                root: { 
                    fontWeight: 600, 
                    letterSpacing: rem(0.5),
                    transition: 'filter 150ms ease',
                    '&:hover': { filter: 'brightness(1.1)' }
                }
            }
        }),

        Badge: Badge.extend({
            defaultProps: {
                variant: 'light',
                radius: 'xs',
                color: 'navy',
            },
            styles: {
                label: { fontWeight: 700, textTransform: 'uppercase' }
            }
        }),

        NavLink: NavLink.extend({
            styles: (theme) => ({
                root: {
                    borderRadius: theme.radius.sm,
                    fontWeight: 500,
                    margin: `${rem(2)} 0`,
                    '&[data-active]': {
                        backgroundColor: theme.colors.navy[0],
                        color: theme.colors.navy[7],
                        borderLeft: `${rem(4)} solid ${theme.colors.navy[7]}`,
                    },
                },
                label: { 
                    fontSize: theme.fontSizes.sm, 
                    textTransform: 'uppercase', 
                    letterSpacing: rem(1) 
                }
            }),
        }),

        Paper: Paper.extend({
            defaultProps: {
                radius: 'md',
                shadow: 'md',
                withBorder: true,
            },
        }),

        Title: Title.extend({
            styles: (theme) => ({
                root: {
                    fontFamily: 'Playfair Display, serif', 
                    color: theme.colors.navy[9],
                    letterSpacing: rem(-0.5),
                    fontWeight: 700,
                },
            }),
        }),
    },
});
