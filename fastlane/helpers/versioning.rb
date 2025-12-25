module Versioning
  def self.version
    JSON.parse(File.read("../package.json"))["version"]
    UI.message("Version: #{version}")
  end

  def self.bump!(xcodeproj:)
    UI.message("Bumping version for #{xcodeproj}")
    increment_build_number(xcodeproj: xcodeproj)
    increment_version_number(
      xcodeproj: xcodeproj,
      version_number: version
    )

    UI.message("Setting versions for Android")
    Android.set_versions(
      version_name: version,
      version_code: get_build_number(xcodeproj: xcodeproj)
    )
  end

  def self.update_changelog!(tag:, changelog:)
    UI.message("Updating changelog for #{tag}")
    
    entry = <<~MD

      ## #{tag}
      #{changelog}

    MD

    if File.exist?("CHANGELOG.md")
      content = File.read("CHANGELOG.md")
      File.write("CHANGELOG.md", entry + content)
    else
      File.write("CHANGELOG.md", "# Changelog\n#{entry}")
    end
  end
end