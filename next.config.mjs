import withMDX from '@next/mdx';

export default withMDX({
  extension: /\.mdx$/,
  pageExtensions: ['js', 'jsx', 'mdx'],
});
