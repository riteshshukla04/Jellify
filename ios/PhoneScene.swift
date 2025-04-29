//
//  PhoneScene.swift
//  Jellify
//
//  Created by Ritesh Shukla on 30/04/25.
//


import Foundation
import UIKit
import SwiftUI

class PhoneSceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }
    guard let windowScene = scene as? UIWindowScene else { return }
    guard let appRootView = appDelegate.window.rootViewController?.view else { return }

    let containerViewController = UIViewController()
    containerViewController.view.backgroundColor = .white

    // Create a view that respects safe area
    let safeAreaContainer = UIView()
    safeAreaContainer.translatesAutoresizingMaskIntoConstraints = false
    containerViewController.view.addSubview(safeAreaContainer)

    NSLayoutConstraint.activate([
      safeAreaContainer.topAnchor.constraint(equalTo: containerViewController.view.safeAreaLayoutGuide.topAnchor),
      safeAreaContainer.bottomAnchor.constraint(equalTo: containerViewController.view.safeAreaLayoutGuide.bottomAnchor),
      safeAreaContainer.leadingAnchor.constraint(equalTo: containerViewController.view.safeAreaLayoutGuide.leadingAnchor),
      safeAreaContainer.trailingAnchor.constraint(equalTo: containerViewController.view.safeAreaLayoutGuide.trailingAnchor),
    ])

    // Add appDelegate's rootViewController's view to safe area
    appRootView.translatesAutoresizingMaskIntoConstraints = false
    safeAreaContainer.addSubview(appRootView)

    NSLayoutConstraint.activate([
      appRootView.topAnchor.constraint(equalTo: safeAreaContainer.topAnchor),
      appRootView.bottomAnchor.constraint(equalTo: safeAreaContainer.bottomAnchor),
      appRootView.leadingAnchor.constraint(equalTo: safeAreaContainer.leadingAnchor),
      appRootView.trailingAnchor.constraint(equalTo: safeAreaContainer.trailingAnchor),
    ])

    let window = UIWindow(windowScene: windowScene)
    window.rootViewController = containerViewController
    self.window = window
    window.makeKeyAndVisible()
  }
}

