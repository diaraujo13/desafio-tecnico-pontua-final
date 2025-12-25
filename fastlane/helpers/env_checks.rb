# Arquivo de helpers para verificar as variáveis de ambiente

module EnvChecks
  def self.require_env!(*vars)
    vars.each do |var|
      next if ENV[var].to_s.strip.size.positive?

      UI.abort_with_message!(
        "ENV is missing #{var}. Add it to .env or your environment."
      )
    end
  end

  def self.forbid_env!(*vars)
    vars.each do |var|
      next if ENV[var].to_s.strip.empty?

      UI.abort_with_message!(
        "ENV #{var} must not be set when running fastlane."
      )
    end
  end
end