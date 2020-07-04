// Log out information after a build is done
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`)
}

exports.onCreateWebpackConfig = ({
	loaders,
	actions,
  }) => {
	actions.setWebpackConfig({
	  module: {
		rules: [
		  {
			test: /\.gltf/,
			use: [ loaders.file() ]
		  },
		],
	  }
	})
  }