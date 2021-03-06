const path = require("path");
const _ = require("lodash");
const webpackLodashPlugin = require("lodash-webpack-plugin");

exports.onCreateNode = ({node, boundActionCreators, getNode}) => {
  const {createNodeField} = boundActionCreators;
  let slug;
  if (node.internal.type === "MarkdownRemark") {
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.relativePath);

    // if (
    //   Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
    //   Object.prototype.hasOwnProperty.call(node.frontmatter, "slug")
    // ) {
    //   slug = `/${_.kebabCase(node.frontmatter.slug)}`;
    // }

    // if (
    //   Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
    //   Object.prototype.hasOwnProperty.call(node.frontmatter, "title")
    // ) {
    //   slug = `/${_.kebabCase(node.frontmatter.title)}`;
    // } else

    // if (// parsedFilePath.name !== "index" &&
    //     parsedFilePath.dir !== "" && parsedFilePath.dir !== null) {

    // } // else

    // if (parsedFilePath.dir === "") {
    //   //slug = `/${parsedFilePath.name}/`;
    //   slug = `${_.trim(parsedFilePath.dir, 'public/')}/${_.trim(_.toLower(parsedFilePath.name))}`;
    // } else {
    //   //slug = `/${parsedFilePath.dir}/`;
    //   slug = `${_.trim(parsedFilePath.dir, 'public/')}`;
    // }

    let dir = `${_.replace(parsedFilePath.dir, 'public', '')}`;
    let name = `${_.trim(_.toLower(parsedFilePath.name))}`;
    slug = `${dir}/${name}`;

    // console.log(parsedFilePath);

    //console.log(slug);
    // if ( Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
    //      Object.prototype.hasOwnProperty.call(node.frontmatter, "prefix")){
    //   createNodeField({node, name: "slug", value: `${node.frontmatter.prefix}${slug}`});
    // } else {
    //   createNodeField({node, name: "slug", value: slug});
    // }
    createNodeField({node, name: "slug", value: slug});
  }
};

exports.createPages = ({graphql, boundActionCreators}) => {
  const {createPage} = boundActionCreators;

  /* add new types of pages for programatic creation here */
  return new Promise((resolve, reject) => {
      // const postPage = path.resolve("src/templates/post.jsx");
      //const tagPage = path.resolve("src/templates/tag.jsx");
    const contentPage = path.resolve("src/templates/content.jsx");
    const overviewPage = path.resolve("src/templates/overview.jsx");
    const categoryPage = path.resolve("src/templates/category.jsx");
    resolve(
      graphql(
        `
        {
          allMarkdownRemark {
            edges {
              node {
                frontmatter {
                  category
                  type
                  source
                }
                fields {
                  slug
                }
              }
            }
          }
        }
      `
      ).then(result => {
        if (result.errors) {
          /* eslint no-console: "off"*/
          console.log(result.errors);
          reject(result.errors);
        }

        //const tagSet = new Set();
        const categorySet = new Set();
        // console.log(result.data.allMarkdownRemark.edges.length)
        // console.log(JSON.stringify(result.data.allMarkdownRemark.edges))
        result.data.allMarkdownRemark.edges.forEach(edge => {
          // if (edge.node.frontmatter.tags) {
          //   edge.node.frontmatter.tags.forEach(tag => {
          //     tagSet.add(tag);
          //   });
          // }

          if (edge.node.frontmatter.category) {
            categorySet.add(edge.node.frontmatter.category);
          }
         //console.log(JSON.stringify(edge.node.frontmatter))
          if (['overview'].includes(edge.node.frontmatter.type)) {
          //console.log(JSON.stringify(edge.node.frontmatter));
          //console.log(edge.node.fields.slug);
          createPage({
            path: edge.node.fields.slug,
            component: overviewPage,
            context: {
              slug: edge.node.fields.slug
            }
          });
          }

          if (['guide', 'content', 'tutorial', 'reference', 'guides', 'tutorials', 'landing'].includes(edge.node.frontmatter.type)) {
              //console.log(JSON.stringify(edge.node.frontmatter));
              //console.log(edge.node.fields.slug);
              createPage({
                  path: edge.node.fields.slug,
                  component: contentPage,
                  context: {
                      category: edge.node.frontmatter.category,
                      slug: edge.node.fields.slug
                  }
              });
          }
        });

        // const tagList = Array.from(tagSet);
        // tagList.forEach(tag => {
        //   createPage({
        //     path: `/tags/${_.kebabCase(tag)}/`,
        //     component: tagPage,
        //     context: {
        //       tag
        //     }
        //   });
        // });

        const categoryList = Array.from(categorySet);
        categoryList.forEach(category => {
          createPage({
            path: `/categories/${_.kebabCase(category)}/`,
            component: categoryPage,
            context: {
              category
            }
          });
        });
      })
    );
  });
};

const generateBabelConfig = require('gatsby/dist/utils/babel-config')
exports.modifyWebpackConfig = ({ config, stage }) => {
  if (stage === "build-javascript") {
    config.plugin("Lodash", webpackLodashPlugin, null);
  }

  const program = {
    directory: __dirname,
    browserslist: ["> 1%", "last 2 versions", "IE >= 9"],
  }

  return generateBabelConfig(program, stage).then(babelConfig => {
    config.removeLoader('js').loader('js', {
      test: /\.jsx?$/,
      exclude: modulePath => {
        return (
          /node_modules/.test(modulePath) &&
          !/node_modules\/(ipfs-api|cids|multihashes|is-ipfs|ipld-dag-pb|multiaddr|multihashing-async|class-is|peer-id|borc|libp2p-crypto|multibase|ipfs-block|ipld-dag-cbor|multicodec|peer-info|ipfs-unixfs)/.test(modulePath)
        )
      },
      loader: 'babel',
      query: babelConfig
    })
  })
}

exports.modifyBabelrc = ({ babelrc }) => ({
  ...babelrc,
  plugins: babelrc.plugins.concat(['transform-regenerator'])
})
