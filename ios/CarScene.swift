// ios/CarScene.swift
import Foundation
import CarPlay

class CarSceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {
  func templateApplicationScene(_ templateApplicationScene: CPTemplateApplicationScene, didConnect interfaceController: CPInterfaceController) {
                                  
    if let applicationDelegate = UIApplication.shared.delegate as? AppDelegate {
    
      if applicationDelegate.bridge == nil {
      
          applicationDelegate.bridge = RCTBridge.init(delegate: applicationDelegate, launchOptions: [:])
          
          applicationDelegate.rootView = RCTRootView.init(
              bridge: applicationDelegate.bridge!,
              moduleName: "Jellify",
              initialProperties: nil
          )
      }
  }                            
    
    RNCarPlay.connect(with: interfaceController, window: templateApplicationScene.carWindow);
    
  }

  func templateApplicationScene(_ templateApplicationScene: CPTemplateApplicationScene, didDisconnectInterfaceController interfaceController: CPInterfaceController) {
  
    RNCarPlay.disconnect()
    
  }
}
