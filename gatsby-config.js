module.exports = {
  siteMetadata: {
    title: `L'Atelier`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@md-prog`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `models`,
        path: `${__dirname}/src/models`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        // start_url: `/vitual-economy/`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#000000`,
        display: `minimal-ui`,
        icon: "src/icons/favicon.png",
        icons:[
          {src:"favicons/icon-48x48.png",sizes:"48x48",type:"image/png"},
          {src:"favicons/icon-72x72.png",sizes:"72x72",type:"image/png"},
          {src:"favicons/icon-96x96.png",sizes:"96x96",type:"image/png"},
          {src:"favicons/icon-144x144.png",sizes:"144x144",type:"image/png"},
          {src:"favicons/icon-192x192.png",sizes:"192x192",type:"image/png"},
          {src:"favicons/icon-256x256.png",sizes:"256x256",type:"image/png"},
          {src:"favicons/icon-384x384.png",sizes:"384x384",type:"image/png"},
          {src:"favicons/icon-512x512.png",sizes:"512x512",type:"image/png"}
        ]
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: 'gatsby-source-prismic',
      options: {
        repositoryName: "latelier",
        accessToken: "MC5YaGVVMXhFQUFDSUFLWkRl.Te-_vS0G77-977-977-9Be-_ve-_ve-_vX_vv73vv73vv70x77-977-9EzY877-9KA8x77-977-977-9P--_vTbvv70",
        schemas: {
          section: {
            Main: {
              title: {
                type: "StructuredText",
                config: {
                  single: "heading1, heading2, heading3, heading4, heading5, heading6",
                  label: "Title"
                }
              },
              display_title: {
                type: "StructuredText",
                config: {
                  single: "heading1",
                  label: "Display Title"
                }
              },
              sub_title: {
                type: "StructuredText",
                config: {
                  single: "heading2, heading3, heading4, heading5, heading6",
                  label: "Sub Title"
                }
              },
              key: {
                type: "Text",
                config: {
                  label: "Key"
                }
              },
              body: {
                type: "Slices",
                fieldset: "Slice zone",
                config: {
                  labels: {
                    pull_quote: [],
                    image: [],
                    emptyspace: [],
                    custom_component: [],
                    image_graph: [],
                    big_numbers: [],
                    big_stats: [],
                    cardswithmodal: [],
                    image_data_visualization: []
                  },
                  choices: {
                    text: {
                      type: "Slice",
                      fieldset: "Text",
                      description: "Rich Text Section",
                      icon: "text_fields",
                      "non-repeat": {
                        text: {
                          type: "StructuredText",
                          config: {
                            multi: "paragraph, preformatted, heading1, heading2, heading3, heading4, heading5, heading6, strong, em, hyperlink, image, embed, list-item, o-list-item, o-list-item",
                            allowTargetBlank: !0,
                            label: "text",
                            placeholder: "Your content here",
                            labels: ["define", "lead", "super"]
                          }
                        }
                      },
                      repeat: {}
                    },
                    pull_quote: {
                      type: "Slice",
                      fieldset: "Pull Quote",
                      description: "Pull Quote Section",
                      icon: "sort",
                      display: "list",
                      "non-repeat": {
                        content: {
                          type: "StructuredText",
                          config: {
                            single: "strong, em",
                            label: "Content"
                          }
                        },
                        size: {
                          type: "Select",
                          config: {
                            options: ["Small", "Large"],
                            default_value: "Small",
                            label: "Size"
                          }
                        }
                      },
                      repeat: {}
                    },
                    image: {
                      type: "Slice",
                      fieldset: "Image",
                      description: "Image",
                      icon: "image",
                      display: "list",
                      "non-repeat": {
                        image: {
                          type: "Image",
                          config: {
                            constraint: {},
                            thumbnails: [],
                            label: "Image"
                          }
                        },
                        caption: {
                          type: "StructuredText",
                          config: {
                            single: "strong, em",
                            label: "Caption"
                          }
                        }
                      },
                      repeat: {}
                    },
                    emptyspace: {
                      type: "Slice",
                      fieldset: "EmptySpace",
                      description: "Adds space where you can see the background",
                      icon: "all_inclusive",
                      display: "list",
                      "non-repeat": {
                        label: {
                          type: "Text",
                          config: {
                            label: "Label"
                          }
                        },
                        height: {
                          type: "Number",
                          config: {
                            label: "Height"
                          }
                        }
                      },
                      repeat: {}
                    },
                    custom_component: {
                      type: "Slice",
                      fieldset: "Custom Component",
                      description: "Add a custom react component here",
                      icon: "adjust",
                      display: "list",
                      "non-repeat": {
                        component: {
                          type: "Text",
                          config: {
                            label: "Component"
                          }
                        }
                      },
                      repeat: {
                        key1: {
                          type: "Text",
                          config: {
                            label: "Key"
                          }
                        },
                        value: {
                          type: "Text",
                          config: {
                            label: "Value"
                          }
                        }
                      }
                    },
                    image_graph: {
                      type: "Slice",
                      fieldset: "Image Graph",
                      description: "A SVG Graph with Title",
                      icon: "grain",
                      display: "list",
                      "non-repeat": {
                        graph_title: {
                          type: "Text",
                          config: {
                            label: "Graph Title"
                          }
                        },
                        graph_subtitle: {
                          type: "Text",
                          config: {
                            label: "Graph Subtitle"
                          }
                        },
                        graph_date_range: {
                          type: "Text",
                          config: {
                            label: "Graph date range"
                          }
                        },
                        source: {
                          type: "Text",
                          config: {
                            label: "Source"
                          }
                        },
                        graph: {
                          type: "Image",
                          config: {
                            constraint: {},
                            thumbnails: [{
                              name: "Mobile",
                              width: 800,
                              height: null
                            }],
                            label: "Graph"
                          }
                        }
                      },
                      repeat: {}
                    },
                    big_numbers: {
                      type: "Slice",
                      fieldset: "Big Numbers",
                      description: "Show several big numbers",
                      icon: "exposure_zero",
                      display: "list",
                      "non-repeat": {
                        title1: {
                          type: "StructuredText",
                          config: {
                            single: "heading3",
                            label: "Title"
                          }
                        },
                        source: {
                          type: "Text",
                          config: {
                            label: "Source"
                          }
                        }
                      },
                      repeat: {
                        number: {
                          type: "Text",
                          config: {
                            label: "Number"
                          }
                        },
                        label: {
                          type: "Text",
                          config: {
                            label: "Label"
                          }
                        }
                      }
                    },
                    big_stats: {
                      type: "Slice",
                      fieldset: "Big Stats",
                      description: "Show label value pairs",
                      icon: "call_merge",
                      display: "list",
                      "non-repeat": {
                        title1: {
                          type: "StructuredText",
                          config: {
                            single: "heading3",
                            label: "Title"
                          }
                        },
                        sub_text: {
                          type: "Text",
                          config: {
                            label: "Sub Text"
                          }
                        }
                      },
                      repeat: {
                        label: {
                          type: "Text",
                          config: {
                            label: "Label"
                          }
                        },
                        value: {
                          type: "Text",
                          config: {
                            label: "Value"
                          }
                        }
                      }
                    },
                    cardswithmodal: {
                      type: "Slice",
                      fieldset: "CardsWithModal",
                      description: "3 Cards that show additional content in a modal",
                      icon: "add_box",
                      display: "list",
                      "non-repeat": {
                        title_1: {
                          type: "StructuredText",
                          config: {
                            single: "heading3",
                            label: "Title 1"
                          }
                        },
                        summary_1: {
                          type: "Text",
                          config: {
                            label: "Summary 1"
                          }
                        },
                        content_1: {
                          type: "StructuredText",
                          config: {
                            multi: "paragraph, heading3, heading4, heading5, heading6, strong, em, hyperlink, list-item, o-list-item",
                            allowTargetBlank: !0,
                            label: "Content 1",
                            labels: ["lead", "super"]
                          }
                        },
                        title_2: {
                          type: "StructuredText",
                          config: {
                            single: "heading3",
                            label: "Title 2"
                          }
                        },
                        summary_2: {
                          type: "Text",
                          config: {
                            label: "Summary 2"
                          }
                        },
                        content_2: {
                          type: "StructuredText",
                          config: {
                            multi: "paragraph, heading3, heading4, heading5, heading6, strong, em, hyperlink, list-item, o-list-item",
                            allowTargetBlank: !0,
                            label: "Content 2",
                            labels: ["lead", "super"]
                          }
                        }
                      },
                      repeat: {}
                    },
                    image_data_visualization: {
                      type: "Slice",
                      fieldset: "Image Data Visualization",
                      description: "Data Visualization",
                      icon: "call_made",
                      display: "list",
                      "non-repeat": {
                        image: {
                          type: "Image",
                          config: {
                            constraint: {},
                            thumbnails: [{
                              name: "Mobile",
                              width: 800,
                              height: null
                            }],
                            label: "Image"
                          }
                        }
                      },
                      repeat: {}
                    }
                  }
                }
              }
            }
          },
          citizen_profiles: {
            Main: {
              citizen: {
                type: "Text",
                config: {
                  label: "Citizen"
                }
              },
              key: {
                type: "Text",
                config: {
                  label: "Key"
                }
              },
              introduction: {
                type: "StructuredText",
                config: {
                  single: "paragraph, strong, em, hyperlink",
                  allowTargetBlank: !0,
                  label: "Introduction"
                }
              },
              content: {
                type: "StructuredText",
                config: {
                  multi: "paragraph, heading3, heading4, heading5, heading6, strong, em, hyperlink, list-item, o-list-item, o-list-item",
                  label: "Content"
                }
              },
              citizen_content: {
                type: "StructuredText",
                config: {
                  multi: "paragraph, heading3, heading4, heading5, heading6, strong, em, hyperlink, list-item, o-list-item",
                  label: "Citizen Content"
                }
              },
              highlight: {
                type: "Color",
                config: {
                  label: "Highlight"
                }
              },
              irl_image: {
                type: "Image",
                config: {
                  constraint: {},
                  thumbnails: [],
                  label: "IRL Image"
                }
              },
              avatar_image: {
                type: "Image",
                config: {
                  constraint: {},
                  thumbnails: [],
                  label: "Avatar Image"
                }
              }
            }
          },
          workers: {
            Main: {
              title: {
                type: "StructuredText",
                config: {
                  single: "heading1, heading2, heading3, heading4, heading5, heading6",
                  label: "Title"
                }
              },
              content: {
                type: "StructuredText",
                config: {
                  multi: "paragraph, heading2, heading3, heading4, heading5, heading6, strong, em, hyperlink, list-item, o-list-item",
                  label: "Content"
                }
              },
              key: {
                type: "Text",
                config: {
                  label: "Key"
                }
              },
              profiles: {
                type: "Group",
                config: {
                  fields: {
                    image: {
                      type: "Image",
                      config: {
                        constraint: {},
                        thumbnails: [],
                        label: "Image"
                      }
                    },
                    title: {
                      type: "StructuredText",
                      config: {
                        single: "heading2",
                        label: "Title"
                      }
                    },
                    color: {
                      type: "Color",
                      config: {
                        label: "Color"
                      }
                    },
                    population_size: {
                      type: "Text",
                      config: {
                        label: "Population Size"
                      }
                    },
                    population_graph_percentage: {
                      type: "Number",
                      config: {
                        label: "Population graph percentage",
                        placeholder: "20"
                      }
                    },
                    income_range: {
                      type: "Text",
                      config: {
                        label: "Income Range"
                      }
                    },
                    income_range_percentage: {
                      type: "Number",
                      config: {
                        label: "Income range percentage",
                        placeholder: "30"
                      }
                    },
                    key_platforms: {
                      type: "Text",
                      config: {
                        label: "Key Platforms"
                      }
                    },
                    types_of_employment: {
                      type: "Text",
                      config: {
                        label: "Types of Employment"
                      }
                    },
                    income_streams: {
                      type: "Text",
                      config: {
                        label: "Income Streams"
                      }
                    },
                    description: {
                      type: "StructuredText",
                      config: {
                        multi: "paragraph, heading3, heading4, heading5, heading6, strong, em, list-item, o-list-item",
                        label: "Description"
                      }
                    }
                  },
                  label: "Profiles"
                }
              }
            }
          },
          privacy: {
            Main: {
              title: {
                type: "StructuredText",
                config: {
                  single: "heading1",
                  label: "Title"
                }
              },
              tagline: {
                type: "StructuredText",
                config: {
                  single: "paragraph, strong, em, hyperlink",
                  allowTargetBlank: !0,
                  label: "Tagline"
                }
              },
              introduction: {
                type: "StructuredText",
                config: {
                  multi: "paragraph, heading2, heading3, heading4, heading5, heading6, strong, em, hyperlink, list-item, o-list-item",
                  allowTargetBlank: !0,
                  label: "Introduction"
                }
              },
              content: {
                type: "StructuredText",
                config: {
                  multi: "paragraph, preformatted, heading2, heading3, heading4, heading5, heading6, strong, em, hyperlink, image, list-item, o-list-item",
                  allowTargetBlank: !0,
                  label: "Content"
                }
              }
            }
          },
          credits: {
            Main: {
              title: {
                type: "StructuredText",
                config: {
                  single: "heading2",
                  label: "Title"
                }
              },
              content: {
                type: "StructuredText",
                config: {
                  multi: "paragraph, heading2, heading3, heading4, heading5, heading6, strong, em, hyperlink, list-item, o-list-item",
                  allowTargetBlank: !0,
                  label: "Content"
                }
              }
            }
          }
        },
        lang: "*"
      },
    },
    {
      resolve: `gatsby-plugin-emotion`,
      options: {
        // Accepts all options defined by `babel-plugin-emotion` plugin.
      },
    },
  ],
}
