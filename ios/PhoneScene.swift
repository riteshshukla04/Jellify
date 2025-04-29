import Foundation
import UIKit
import SwiftUI


extension UIColor {
    convenience init(hex: String) {
        var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")

        var rgb: UInt64 = 0
        Scanner(string: hexSanitized).scanHexInt64(&rgb)

        let r = (rgb & 0xFF0000) >> 16
        let g = (rgb & 0x00FF00) >> 8
        let b = rgb & 0x0000FF

        self.init(
            red: CGFloat(r) / 255,
            green: CGFloat(g) / 255,
            blue: CGFloat(b) / 255,
            alpha: 1.0
        )
    }
}



class PhoneSceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }
    guard let windowScene = scene as? UIWindowScene else { return }
    guard let appRootView = appDelegate.window?.rootViewController?.view else { return }

    let containerViewController = UIViewController()
    containerViewController.view.backgroundColor = .systemBackground // dynamic light/dark

    // Create safe area container
    let safeAreaContainer = UIView()
    safeAreaContainer.translatesAutoresizingMaskIntoConstraints = false
    containerViewController.view.addSubview(safeAreaContainer)

    NSLayoutConstraint.activate([
      safeAreaContainer.topAnchor.constraint(equalTo: containerViewController.view.safeAreaLayoutGuide.topAnchor),
      safeAreaContainer.bottomAnchor.constraint(equalTo: containerViewController.view.safeAreaLayoutGuide.bottomAnchor),
      safeAreaContainer.leadingAnchor.constraint(equalTo: containerViewController.view.safeAreaLayoutGuide.leadingAnchor),
      safeAreaContainer.trailingAnchor.constraint(equalTo: containerViewController.view.safeAreaLayoutGuide.trailingAnchor),
    ])

    // Create colored views for top and bottom safe area
    let topBar = UIView()
    let bottomBar = UIView()
    topBar.translatesAutoresizingMaskIntoConstraints = false
    bottomBar.translatesAutoresizingMaskIntoConstraints = false

    // Color that automatically adapts to dark/light mode
    topBar.backgroundColor = UIColor { trait in
      return trait.userInterfaceStyle == .dark ? UIColor(hex: "#0C0622") : UIColor(hex:"#FFFFFF")
    }
    bottomBar.backgroundColor = UIColor { trait in
      return trait.userInterfaceStyle == .dark ? UIColor(hex:"#0C0622") : UIColor(hex:"#FFFFFF")
    }

    containerViewController.view.addSubview(topBar)
    containerViewController.view.addSubview(bottomBar)

    NSLayoutConstraint.activate([
      // Top bar
      topBar.topAnchor.constraint(equalTo: containerViewController.view.topAnchor),
      topBar.leadingAnchor.constraint(equalTo: containerViewController.view.leadingAnchor),
      topBar.trailingAnchor.constraint(equalTo: containerViewController.view.trailingAnchor),
      topBar.bottomAnchor.constraint(equalTo: containerViewController.view.safeAreaLayoutGuide.topAnchor),

      // Bottom bar
      bottomBar.topAnchor.constraint(equalTo: containerViewController.view.safeAreaLayoutGuide.bottomAnchor),
      bottomBar.leadingAnchor.constraint(equalTo: containerViewController.view.leadingAnchor),
      bottomBar.trailingAnchor.constraint(equalTo: containerViewController.view.trailingAnchor),
      bottomBar.bottomAnchor.constraint(equalTo: containerViewController.view.bottomAnchor),
    ])

    // Add appRootView inside safeAreaContainer
    appRootView.translatesAutoresizingMaskIntoConstraints = false
    safeAreaContainer.addSubview(appRootView)

    NSLayoutConstraint.activate([
      appRootView.topAnchor.constraint(equalTo: safeAreaContainer.topAnchor),
      appRootView.bottomAnchor.constraint(equalTo: safeAreaContainer.bottomAnchor),
      appRootView.leadingAnchor.constraint(equalTo: safeAreaContainer.leadingAnchor),
      appRootView.trailingAnchor.constraint(equalTo: safeAreaContainer.trailingAnchor),
    ])

    // Set up the window
    let window = UIWindow(windowScene: windowScene)
    window.rootViewController = containerViewController
    self.window = window
    window.makeKeyAndVisible()
  }
}
