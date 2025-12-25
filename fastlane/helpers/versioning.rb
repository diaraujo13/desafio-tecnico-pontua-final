module Versioning
  def self.version
    JSON.parse(File.read("../package.json"))["version"]
  end

  def self.update_changelog!(tag:, changelog:)
    entry = <<~MD

      ## #{tag}
      #{changelog}

    MD

    if File.exist?("CHANGELOG.md")
      File.write("CHANGELOG.md", entry + File.read("CHANGELOG.md"))
    else
      File.write("CHANGELOG.md", "# Changelog\n#{entry}")
    end
  end
end