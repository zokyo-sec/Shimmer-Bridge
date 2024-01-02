import Head from 'next/head';

import {useTheme} from '@/core/ui/system';

interface CustomHtmlHeadProps {
    description?: string;
    title?: string;
    url?: string;
}

const titleBase = 'ShimmerBridge';
const defaultTitle = `${titleBase}`;
const defaultDescription = `ShimmerBridge is a web application that allows you to transfer wrapped tokens between
ShimmerEVM and several other blockchain networks by interacting with the decentralized smart contracts of LayerZero 
deployed on each of those networks. ShimmerBridge supports connections from ShimmerEVM to Ethereum, Avalanche C-Chain, 
Polygon, Arbitrum One, Optimism, Base, Fantom, and Binance Smart Chain. You can transfer several wrapped tokens, 
including ETH, USDT, USDC, WBTC, AVAX, MATIC, FTM, and BNB.
`;


function generateKeywords(description: string) {
    // Remove special characters and split the description into words
    const words = description.replace(/[^\w\s]|_/g, "").split(/\s+/);

    // Define a list of common words to exclude
    const commonWords = ["is", "a", "that", "you", "to", "and", "can", "the", "of", "on", "from", "with", "by", "several", "other", "each", "those", "including", ""];

    // Filter out common words and return the unique words
    return [...new Set(words.filter(word => !commonWords.includes(word.toLowerCase())))];
}

const keywords = `shimmerBridge, shimmerbridge, ShimmerBridge, Shimmer, shimmer, layerzero, blockchain, crypto, message, transaction, omnichain, bridge, ${generateKeywords(defaultDescription).join(", ")}`;

export const CustomHtmlHead = (props: CustomHtmlHeadProps) => {
    const {title, description = defaultDescription, url} = props;
    const metaTitle = title ? `${title} | ${titleBase}` : defaultTitle;
    const theme = useTheme();
    return (
        <Head>
            <title>{metaTitle}</title>
            <meta charSet='utf-8'/>
            <meta name='description' content={description}/>
            {url && <link rel='canonical' href={url}/>}
            {url && <meta name='og:url' content={url}/>}
            <meta name='og:title' content={metaTitle}/>
            <meta name='og:site_name' content={metaTitle}/>
            <meta name='og:description' content={description}/>
            <meta name='og:type' content='site'/>
            <meta name='og:image' content='/static/favicon/ms-icon-310x310.png'/>
            <meta name='language' content='english'/>
            <meta httpEquiv='content-type' content='text/html'/>
            <meta name='author' content={'ShimmerBridge'}/>
            <meta name='designer' content={'ShimmerBridge'}/>
            <meta name='publisher' content={'ShimmerBridge'}/>
            <meta name='keywords' content={keywords}/>
            <meta name='distribution' content='web'/>
            <meta name='msapplication-TileColor' content={theme.palette.primary.main ?? '#000000'}/>
            <meta name='theme-color' content={theme.palette.primary.main ?? '#000000'}/>
            <meta name='viewport' content='width=device-width, minimum-scale=1, initial-scale=1.0'/>
            {/*<meta name='twitter:card' content='summary'/>*/}
            {/*<meta name='twitter:site' content='@ShimmerBridge'/>*/}
            {/*<meta name='twitter:image' content={'/static/favicon/ms-icon-310x310.png'}/>*/}

            <link rel="apple-touch-icon" sizes="57x57" href="/static/favicon/apple-icon-57x57.png"/>
            <link rel="apple-touch-icon" sizes="60x60" href="/static/favicon/apple-icon-60x60.png"/>
            <link rel="apple-touch-icon" sizes="72x72" href="/static/favicon/apple-icon-72x72.png"/>
            <link rel="apple-touch-icon" sizes="76x76" href="/static/favicon/apple-icon-76x76.png"/>
            <link rel="apple-touch-icon" sizes="114x114" href="/static/favicon/apple-icon-114x114.png"/>
            <link rel="apple-touch-icon" sizes="120x120" href="/static/favicon/apple-icon-120x120.png"/>
            <link rel="apple-touch-icon" sizes="144x144" href="/static/favicon/apple-icon-144x144.png"/>
            <link rel="apple-touch-icon" sizes="152x152" href="/static/favicon/apple-icon-152x152.png"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/static/favicon/apple-icon-180x180.png"/>
            <link rel="icon" type="image/png" sizes="192x192" href="/static/favicon/android-icon-192x192.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="96x96" href="/static/favicon/favicon-96x96.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon/favicon-16x16.png"/>
            <link rel="manifest" href="/static/manifest.json"/>
            <meta name="msapplication-TileColor" content="#ffffff"/>
            <meta name="msapplication-TileImage" content="/static/ms-icon-144x144.png"/>
            <meta name="msapplication-config" content="/static/browserconfig.xml"/>
            <meta name="application-name" content="ShimmerBridge"/>
        </Head>
    );
};
