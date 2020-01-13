pkgdatadir = join_paths(get_option('datadir'), meson.project_name())
gnome = import('gnome')

src_res = gnome.compile_resources('com.hack_computer.gst-test.src',
  'com.hack_computer.gst-test.src.gresource.xml',
  gresource_bundle: true,
  install: true,
  install_dir: pkgdatadir,
)

data_res = gnome.compile_resources('com.hack_computer.gst-test.data',
  'com.hack_computer.gst-test.data.gresource.xml',
  gresource_bundle: true,
  install: true,
  install_dir: pkgdatadir,
)

bin_conf = configuration_data()
bin_conf.set('GJS', find_program('gjs').path())
bin_conf.set('PACKAGE_VERSION', meson.project_version())
bin_conf.set('PACKAGE_NAME', meson.project_name())
bin_conf.set('prefix', get_option('prefix'))
bin_conf.set('libdir', join_paths(get_option('prefix'), get_option('libdir')))
bin_conf.set('datadir', join_paths(get_option('prefix'), get_option('datadir')))

configure_file(
  input: 'com.hack_computer.gst-test.in',
  output: 'com.hack_computer.gst-test',
  configuration: bin_conf,
  install: true,
  install_dir: get_option('bindir')
)

gio = dependency('gio-2.0')
gio_unix = dependency('gio-unix-2.0')
glib = dependency('glib-2.0')
gobject = dependency('gobject-2.0')

installed_headers = [
    'lib.h',
]
private_headers = [
]
sources = [
    'lib.c',
]

include = include_directories('.')

api_version = '0'
api_name = '@0@-@1@'.format(meson.project_name(), api_version)
libtool_version = '0.0.0'
namespace_name = 'Lib'
main_library = shared_library('@0@-@1@'.format(meson.project_name(), api_version),
    sources, installed_headers, private_headers,
    c_args: ['-DG_LOG_DOMAIN="@0@"'.format(namespace_name),
             '-DCOMPILING_LIB'],
    dependencies: [gio, gio_unix, glib, gobject],
    include_directories: include, install: true,
    soversion: api_version, version: libtool_version)

introspection_sources = [
    sources,
    installed_headers
]

gnome.generate_gir(main_library, extra_args: ['--warn-all', '--warn-error'],
    identifier_prefix: 'Lib', include_directories: include,
    includes: ['Gio-2.0', 'GLib-2.0', 'GObject-2.0'],
    install: true, namespace: namespace_name, nsversion: api_version,
    sources: introspection_sources, symbol_prefix: 'lib')

install_headers(installed_headers, subdir: api_name)
