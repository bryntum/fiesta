#!/usr/bin/perl

use strict;
use warnings;

use Dancer;

use Path::Class;

$SIG{CHLD} = "IGNORE";

set port         => 3001;
set startup_info => 0;

my $script_dir  = dir(__FILE__);

post '/afterpush' => sub {
    if (fork() == 0) {
       exec(file($script_dir, 'restart-server.sh'));
    }

    return 'Ok';
};

start;