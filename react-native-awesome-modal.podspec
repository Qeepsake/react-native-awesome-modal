require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, "10.0"

  s.source       = { :git => "https://github.com/aspect-apps/react-native-awesome-modal.git", :tag => "v#{s.version}" }

  s.dependency 'React'
  s.dependency 'react-native-safe-area', '->0.5.1'
end
